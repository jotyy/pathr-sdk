import BigNumber from 'bignumber.js';
import { NotSupportedTokensError, RubicSdkError, TooLowAmountError } from 'src/common/errors';
import { PriceToken, PriceTokenAmount, TokenAmount } from 'src/common/tokens';
import { nativeTokensList } from 'src/common/tokens/constants/native-tokens';
import { BlockchainName, EvmBlockchainName } from 'src/core/blockchain/models/blockchain-name';
import { blockchainId } from 'src/core/blockchain/utils/blockchains-info/constants/blockchain-id';
import { EvmWeb3Public } from 'src/core/blockchain/web3-public-service/web3-public/evm-web3-public/evm-web3-public';
import { Web3Pure } from 'src/core/blockchain/web3-pure/web3-pure';
import { Injector } from 'src/core/injector/injector';
import { getFromWithoutFee } from 'src/features/common/utils/get-from-without-fee';
import { RequiredCrossChainOptions } from 'src/features/cross-chain/calculation-manager/models/cross-chain-options';
import { CROSS_CHAIN_TRADE_TYPE } from 'src/features/cross-chain/calculation-manager/models/cross-chain-trade-type';
import { CrossChainProvider } from 'src/features/cross-chain/calculation-manager/providers/common/cross-chain-provider';
import { CalculationResult } from 'src/features/cross-chain/calculation-manager/providers/common/models/calculation-result';
import { FeeInfo } from 'src/features/cross-chain/calculation-manager/providers/common/models/fee-info';
import { RubicStep } from 'src/features/cross-chain/calculation-manager/providers/common/models/rubicStep';
import { ProxyCrossChainEvmTrade } from 'src/features/cross-chain/calculation-manager/providers/common/proxy-cross-chain-evm-facade/proxy-cross-chain-evm-trade';
import { DE_BRIDGE_CONTRACT_ABI } from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/constants/contract-abi';
import { DE_BRIDGE_CONTRACT_ADDRESS } from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/constants/contract-address';
import {
    DeBridgeCrossChainSupportedBlockchain,
    deBridgeCrossChainSupportedBlockchains
} from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/constants/debridge-cross-chain-supported-blockchain';
import { DE_BRIDGE_GATE_CONTRACT_ABI } from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/constants/gate-contract-abi';
import { DebridgeCrossChainTrade } from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/debridge-cross-chain-trade';
import { Estimation } from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/models/estimation-response';
import { TransactionRequest } from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/models/transaction-request';
import {
    TransactionErrorResponse,
    TransactionResponse
} from 'src/features/cross-chain/calculation-manager/providers/debridge-provider/models/transaction-response';
import { ON_CHAIN_TRADE_TYPE } from 'src/features/on-chain/calculation-manager/providers/common/models/on-chain-trade-type';

export class DebridgeCrossChainProvider extends CrossChainProvider {
    public static readonly apiEndpoint = 'https://api.dln.trade/v1.0/dln';

    public readonly type = CROSS_CHAIN_TRADE_TYPE.DEBRIDGE;

    public isSupportedBlockchain(
        blockchain: BlockchainName
    ): blockchain is DeBridgeCrossChainSupportedBlockchain {
        return deBridgeCrossChainSupportedBlockchains.some(
            supportedBlockchain => supportedBlockchain === blockchain
        );
    }

    private static async getDeBridgeGateAddress(
        web3Public: EvmWeb3Public,
        fromBlockchain: DeBridgeCrossChainSupportedBlockchain
    ): Promise<string> {
        return await web3Public.callContractMethod(
            DE_BRIDGE_CONTRACT_ADDRESS[fromBlockchain].providerRouter,
            DE_BRIDGE_CONTRACT_ABI,
            'deBridgeGate'
        );
    }

    private static async getCryptoFeeAmount(
        web3Public: EvmWeb3Public,
        fromBlockchain: DeBridgeCrossChainSupportedBlockchain
    ): Promise<string> {
        const deBridgeGateAddress = await DebridgeCrossChainProvider.getDeBridgeGateAddress(
            web3Public,
            fromBlockchain
        );

        return web3Public.callContractMethod(
            deBridgeGateAddress,
            DE_BRIDGE_GATE_CONTRACT_ABI,
            'globalFixedNativeFee'
        );
    }

    public async calculate(
        from: PriceTokenAmount<EvmBlockchainName>,
        toToken: PriceToken<EvmBlockchainName>,
        options: RequiredCrossChainOptions
    ): Promise<CalculationResult> {
        const fromBlockchain = from.blockchain as DeBridgeCrossChainSupportedBlockchain;
        const toBlockchain = toToken.blockchain as DeBridgeCrossChainSupportedBlockchain;
        const useProxy = options?.useProxy?.[this.type] ?? true;

        if (!this.areSupportedBlockchains(fromBlockchain, toBlockchain)) {
            return {
                trade: null,
                error: new NotSupportedTokensError(),
                tradeType: this.type
            };
        }

        try {
            const fakeAddress = '0xe388Ed184958062a2ea29B7fD049ca21244AE02e';

            const feeInfo = await this.getFeeInfo(
                fromBlockchain,
                options.providerAddress,
                from,
                useProxy
            );
            const fromWithoutFee = getFromWithoutFee(
                from,
                feeInfo.rubicProxy?.platformFee?.percent
            );

            const requestParams: TransactionRequest = {
                srcChainId: blockchainId[fromBlockchain],
                srcChainTokenIn: from.address,
                srcChainTokenInAmount: fromWithoutFee.stringWeiAmount,
                dstChainId: blockchainId[toBlockchain],
                dstChainTokenOut: toToken.address,
                dstChainTokenOutRecipient: this.getWalletAddress(fromBlockchain) || fakeAddress,
                prependOperatingExpenses: false
            };

            const { tx, estimation } = await Injector.httpClient.get<TransactionResponse>(
                `${DebridgeCrossChainProvider.apiEndpoint}/order/quote`,
                {
                    params: requestParams as unknown as {}
                }
            );

            const to = new PriceTokenAmount({
                ...toToken.asStruct,
                tokenAmount: Web3Pure.fromWei(
                    estimation.dstChainTokenOut.maxTheoreticalAmount,
                    estimation.dstChainTokenOut.decimals
                )
            });

            const slippage = 0;
            const toTokenAmountMin = Web3Pure.fromWei(
                estimation.dstChainTokenOut.amount,
                estimation.dstChainTokenOut.decimals
            ).multipliedBy(1 - slippage);

            const transitToken = estimation.srcChainTokenOut || estimation.srcChainTokenIn;

            const web3Public = Injector.web3PublicService.getWeb3Public(fromBlockchain);
            const cryptoFeeAmount = await DebridgeCrossChainProvider.getCryptoFeeAmount(
                web3Public,
                fromBlockchain
            );

            const nativeToken = nativeTokensList[fromBlockchain];
            const cryptoFeeToken = await PriceTokenAmount.createFromToken({
                ...nativeToken,
                weiAmount: new BigNumber(cryptoFeeAmount)
            });

            const gasData =
                options.gasCalculation === 'enabled'
                    ? await DebridgeCrossChainTrade.getGasData(
                          from,
                          to,
                          requestParams,
                          feeInfo,
                          options.providerAddress,
                          options.receiverAddress
                      )
                    : null;

            return {
                trade: new DebridgeCrossChainTrade(
                    {
                        from,
                        to,
                        transactionRequest: requestParams,
                        gasData,
                        priceImpact: from.calculatePriceImpactPercent(to),
                        allowanceTarget: tx.allowanceTarget,
                        slippage,
                        feeInfo: {
                            ...feeInfo,
                            provider: {
                                cryptoFee: {
                                    amount: Web3Pure.fromWei(new BigNumber(cryptoFeeAmount)),
                                    token: cryptoFeeToken
                                }
                            }
                        },
                        transitAmount: Web3Pure.fromWei(transitToken.amount, transitToken.decimals),
                        toTokenAmountMin,
                        maxTheoreticalAmount: Web3Pure.fromWei(
                            estimation.dstChainTokenOut.maxTheoreticalAmount
                        ),
                        cryptoFeeToken,
                        onChainTrade: null
                    },
                    options.providerAddress,
                    await this.getRoutePath(estimation, from, to)
                ),
                tradeType: this.type
            };
        } catch (err) {
            const rubicSdkError = CrossChainProvider.parseError(err);
            const debridgeApiError = this.parseDebridgeApiError(err);

            return {
                trade: null,
                error: debridgeApiError || rubicSdkError,
                tradeType: this.type
            };
        }
    }

    protected async getFeeInfo(
        fromBlockchain: DeBridgeCrossChainSupportedBlockchain,
        providerAddress: string,
        percentFeeToken: PriceTokenAmount,
        useProxy: boolean
    ): Promise<FeeInfo> {
        return ProxyCrossChainEvmTrade.getFeeInfo(
            fromBlockchain,
            providerAddress,
            percentFeeToken,
            useProxy
        );
    }

    private parseDebridgeApiError(httpErrorResponse: {
        error: TransactionErrorResponse;
    }): RubicSdkError | null {
        if (
            httpErrorResponse?.error?.errorId === 'INCLUDED_GAS_FEE_NOT_COVERED_BY_INPUT_AMOUNT' ||
            httpErrorResponse?.error?.errorId === 'ERROR_LOW_GIVE_AMOUNT'
        ) {
            return new TooLowAmountError();
        }

        // @TODO handle other debridge API error codes:
        // CONNECTOR_1INCH_RETURNED_ERROR
        // INCLUDED_GAS_FEE_CANNOT_BE_ESTIMATED_FOR_TRANSACTION_BUNDLE

        return null;
    }

    protected async getRoutePath(
        estimation: Estimation,
        from: PriceTokenAmount,
        to: PriceTokenAmount
    ): Promise<RubicStep[]> {
        const fromChainId = String(blockchainId[from.blockchain]);
        const toChainId = String(blockchainId[to.blockchain]);

        const transitFrom = [...estimation.costsDetails]
            .reverse()
            .find(el => el.chain === fromChainId);
        const transitTo = estimation.costsDetails.find(el => el.chain === toChainId);

        const fromTokenAmount = transitFrom
            ? await TokenAmount.createToken({
                  blockchain: from.blockchain,
                  address: transitFrom!.tokenOut,
                  weiAmount: new BigNumber(transitFrom!.amountOut)
              })
            : from;

        const toTokenAmount = transitTo
            ? await TokenAmount.createToken({
                  blockchain: to.blockchain,
                  address: transitTo!.tokenIn,
                  weiAmount: new BigNumber(transitTo!.amountIn)
              })
            : to;

        // @TODO Add dex true provider and path
        return [
            {
                type: 'on-chain',
                path: [from, fromTokenAmount],
                provider: ON_CHAIN_TRADE_TYPE.ONE_INCH
            },
            {
                type: 'cross-chain',
                path: [fromTokenAmount, toTokenAmount],
                provider: CROSS_CHAIN_TRADE_TYPE.DEBRIDGE
            },
            {
                type: 'on-chain',
                path: [toTokenAmount, to],
                provider: ON_CHAIN_TRADE_TYPE.ONE_INCH
            }
        ];
    }
}
