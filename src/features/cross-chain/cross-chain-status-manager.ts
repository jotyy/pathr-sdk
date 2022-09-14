/* eslint-disable no-debugger */
import { TransactionReceipt } from 'web3-eth';
import { BLOCKCHAIN_NAME, BlockchainName, BlockchainsInfo } from 'src/core';
import { Injector } from 'src/core/sdk/injector';
import { celerCrossChainEventStatusesAbi } from 'src/features/cross-chain/providers/celer-trade-provider/constants/celer-cross-chain-event-statuses-abi';
import { LogsDecoder } from 'src/features/cross-chain/utils/decode-logs';
import { StatusResponse, TransactionStatus } from 'rango-sdk-basic/lib';
import { Via } from '@viaprotocol/router-sdk';
import { VIA_DEFAULT_CONFIG } from 'src/features/cross-chain/providers/via-trade-provider/constants/via-default-api-key';
import { ViaSwapStatus } from 'src/features/cross-chain/providers/via-trade-provider/models/via-swap-status';
import { CROSS_CHAIN_TRADE_TYPE, CrossChainTradeType } from './models/cross-chain-trade-type';
import { celerCrossChainContractAbi } from './providers/celer-trade-provider/constants/celer-cross-chain-contract-abi';
import { celerCrossChainContractsAddresses } from './providers/celer-trade-provider/constants/celer-cross-chain-contracts-addresses';
import { CelerCrossChainSupportedBlockchain } from './providers/celer-trade-provider/constants/celer-cross-chain-supported-blockchain';
import { CelerSwapStatus } from './providers/common/celer-rubic/models/celer-swap-status.enum';
import { CrossChainStatus } from './models/cross-chain-status';
import { CrossChainTxStatus } from './models/cross-chain-tx-status';
import { LifiSwapStatus } from './providers/lifi-trade-provider/models/lifi-swap-status';
import { SymbiosisSwapStatus } from './providers/symbiosis-trade-provider/models/symbiosis-swap-status';
import { CrossChainTradeData } from './models/cross-chain-trade-data';
import { RANGO_API_KEY } from './providers/rango-trade-provider/constants/rango-api-key';
import {
    BtcStatusResponse,
    DeBridgeApiResponse,
    DstTxData,
    getDstTxStatusFn,
    SymbiosisApiResponse
} from './models/statuses-api';

/**
 * Contains methods for getting cross-chain trade statuses.
 */
export class CrossChainStatusManager {
    private readonly httpClient = Injector.httpClient;

    private readonly getDstTxStatusFnMap: Record<CrossChainTradeType, getDstTxStatusFn> = {
        [CROSS_CHAIN_TRADE_TYPE.CELER]: this.getCelerDstSwapStatus,
        [CROSS_CHAIN_TRADE_TYPE.RUBIC]: this.getRubicDstSwapStatus,
        [CROSS_CHAIN_TRADE_TYPE.LIFI]: this.getLifiDstSwapStatus,
        [CROSS_CHAIN_TRADE_TYPE.SYMBIOSIS]: this.getSymbiosisDstSwapStatus,
        [CROSS_CHAIN_TRADE_TYPE.DEBRIDGE]: this.getDebridgeDstSwapStatus,
        [CROSS_CHAIN_TRADE_TYPE.VIA]: this.getViaDstSwapStatus,
        [CROSS_CHAIN_TRADE_TYPE.RANGO]: this.getRangoDstSwapStatus
    };

    /**
     * Returns cross-chain trade statuses on the source and target network.
     * The result consists of the status of the source and target transactions.
     * @example
     * ```ts
     * const tradeData = {
     *   fromBlockchain: BLOCKCHAIN_NAME.FANTOM,
     *   toBlockchain: BLOCKCHAIN_NAME.BSC,
     *   txTimestamp: 1658241570024,
     *   srxTxHash: '0xd2263ca82ac0fce606cb75df27d7f0dc94909d41a58c37563bd6772496cb8924'
     * };
     * const provider = CROSS_CHAIN_TRADE_TYPE.CELER;
     * const crossChainStatus = await sdk.crossChainStatusManager.getCrossChainStatus(tradeData, provider);
     * console.log('Source transaction status', crossChainStatus.srcTxStatus);
     * console.log('Destination transaction status', crossChainStatus.dstTxStatus);
     * ```
     * @param data Data needed to calculate statuses.
     * @param provider Cross-chain trade type.
     * @returns Object with transaction statuses.
     */
    public async getCrossChainStatus(
        data: CrossChainTradeData,
        provider: CrossChainTradeType
    ): Promise<CrossChainStatus> {
        const crossChainStatus: CrossChainStatus = {
            srcTxStatus: CrossChainTxStatus.UNKNOWN,
            dstTxStatus: CrossChainTxStatus.UNKNOWN,
            dstTxHash: null
        };
        const { fromBlockchain, srcTxHash } = data;
        const srcTxReceipt = await this.getTxReceipt(fromBlockchain, srcTxHash as string);
        const srcTxStatus = this.getSrcTxStatus(srcTxReceipt);

        crossChainStatus.srcTxStatus = srcTxStatus;

        const dstTxData = await this.getDstTxStatus(
            srcTxStatus,
            srcTxReceipt as TransactionReceipt,
            data,
            provider
        );

        crossChainStatus.dstTxHash = dstTxData.txHash;

        if (
            dstTxData.txStatus === CrossChainTxStatus.FAIL &&
            srcTxStatus === CrossChainTxStatus.PENDING
        ) {
            crossChainStatus.srcTxStatus = CrossChainTxStatus.FAIL;
        }

        crossChainStatus.dstTxStatus = dstTxData.txStatus;

        return crossChainStatus;
    }

    /**
     * Get cross-chain trade's source transaction status via receipt.
     * @param srcTxReceipt Transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private getSrcTxStatus(srcTxReceipt: TransactionReceipt | null): CrossChainTxStatus {
        if (srcTxReceipt === null) {
            return CrossChainTxStatus.PENDING;
        }

        if (srcTxReceipt.status) {
            return CrossChainTxStatus.SUCCESS;
        }

        return CrossChainTxStatus.FAIL;
    }

    /**
     * Get destination transaction status based on source transaction status,
     * source transaction receipt, trade data and provider type.
     * @param srcTxStatus Source transaction status.
     * @param srcTxReceipt Source transaction receipt.
     * @param tradeData Trade data.
     * @param provider Cross-chain trade type.
     * @returns Cross-chain transaction status.
     */
    private async getDstTxStatus(
        srcTxStatus: CrossChainTxStatus,
        srcTxReceipt: TransactionReceipt,
        tradeData: CrossChainTradeData,
        provider: CrossChainTradeType
    ): Promise<DstTxData> {
        if (srcTxStatus === CrossChainTxStatus.FAIL) {
            return { txHash: null, txStatus: CrossChainTxStatus.FAIL };
        }

        if (srcTxStatus === CrossChainTxStatus.PENDING) {
            return { txHash: null, txStatus: CrossChainTxStatus.PENDING };
        }

        return await this.getDstTxStatusFnMap[provider].call(this, tradeData, srcTxReceipt);
    }

    /**
     * Get Rango trade dst transaction status.
     * @param data Trade data.
     * @param srcTxReceipt Source transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private async getRangoDstSwapStatus(
        data: CrossChainTradeData,
        srcTxReceipt: TransactionReceipt
    ): Promise<DstTxData> {
        try {
            const { rangoRequestId: requestId } = data;
            const rangoTradeStatusResponse = await Injector.httpClient.get<StatusResponse>(
                'https://api.rango.exchange/basic/status',
                {
                    params: {
                        apiKey: RANGO_API_KEY,
                        requestId: requestId as string,
                        txId: srcTxReceipt.transactionHash
                    }
                }
            );
            const dstTxData: DstTxData = {
                txStatus: CrossChainTxStatus.UNKNOWN,
                txHash: null
            };

            if (rangoTradeStatusResponse.status === TransactionStatus.SUCCESS) {
                dstTxData.txStatus = CrossChainTxStatus.SUCCESS;
            }

            if (rangoTradeStatusResponse.status === TransactionStatus.FAILED) {
                const type = rangoTradeStatusResponse?.output?.type;

                if (type === 'MIDDLE_ASSET_IN_SRC' || type === 'MIDDLE_ASSET_IN_DEST') {
                    dstTxData.txStatus = CrossChainTxStatus.FALLBACK;
                }

                if (type === 'REVERTED_TO_INPUT') {
                    dstTxData.txStatus = CrossChainTxStatus.REVERT;
                }

                dstTxData.txStatus = CrossChainTxStatus.FAIL;
            }

            if (
                rangoTradeStatusResponse.status === TransactionStatus.RUNNING ||
                rangoTradeStatusResponse.status === null
            ) {
                dstTxData.txStatus = CrossChainTxStatus.PENDING;
            }

            return dstTxData;
        } catch {
            return {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
        }
    }

    /**
     * Get Symbiosis trade dst transaction status.
     * @param data Trade data.
     * @param srcTxReceipt Source transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private async getSymbiosisDstSwapStatus(
        data: CrossChainTradeData,
        srcTxReceipt: TransactionReceipt
    ): Promise<DstTxData> {
        const symbiosisTxIndexingTimeSpent = Date.now() > data.txTimestamp + 30000;

        if (symbiosisTxIndexingTimeSpent) {
            try {
                const srcChainId = BlockchainsInfo.getBlockchainByName(data.fromBlockchain).id;
                const {
                    status: { text: dstTxStatus },
                    tx: { hash: dstHash }
                } = await Injector.httpClient.get<SymbiosisApiResponse>(
                    `https://api.symbiosis.finance/crosschain/v1/tx/${srcChainId}/${srcTxReceipt.transactionHash}`
                );
                let dstTxData: DstTxData = {
                    txStatus: CrossChainTxStatus.PENDING,
                    txHash: dstHash || null
                };

                if (
                    dstTxStatus === SymbiosisSwapStatus.PENDING ||
                    dstTxStatus === SymbiosisSwapStatus.NOT_FOUND
                ) {
                    dstTxData.txStatus = CrossChainTxStatus.PENDING;
                }

                if (dstTxStatus === SymbiosisSwapStatus.STUCKED) {
                    dstTxData.txStatus = CrossChainTxStatus.REVERT;
                }

                if (dstTxStatus === SymbiosisSwapStatus.REVERTED) {
                    dstTxData.txStatus = CrossChainTxStatus.FALLBACK;
                }

                if (dstTxStatus === SymbiosisSwapStatus.SUCCESS) {
                    if (data.toBlockchain !== BLOCKCHAIN_NAME.BITCOIN) {
                        dstTxData.txStatus = CrossChainTxStatus.SUCCESS;
                    }

                    dstTxData = await this.getBitcoinStatus(dstHash);
                }
            } catch (error) {
                console.debug('[Symbiosis Trade] Error retrieving dst tx status', error);
                return {
                    txStatus: CrossChainTxStatus.PENDING,
                    txHash: null
                };
            }
        }

        return {
            txStatus: CrossChainTxStatus.PENDING,
            txHash: null
        };
    }

    /**
     * Get Li-fi trade dst transaction status.
     * @param data Trade data.
     * @param srcTxReceipt Source transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private async getLifiDstSwapStatus(
        data: CrossChainTradeData,
        srcTxReceipt: TransactionReceipt
    ): Promise<DstTxData> {
        if (!data.lifiBridgeType) {
            return {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
        }

        try {
            const params = {
                bridge: data.lifiBridgeType,
                fromChain: BlockchainsInfo.getBlockchainByName(data.fromBlockchain).id,
                toChain: BlockchainsInfo.getBlockchainByName(data.toBlockchain).id,
                txHash: srcTxReceipt.transactionHash
            };
            const { status, receiving } = await Injector.httpClient.get<{
                status: LifiSwapStatus;
                receiving: { txHash: string };
            }>('https://li.quest/v1/status', { params });
            const dstTxData: DstTxData = {
                txStatus: CrossChainTxStatus.UNKNOWN,
                txHash: receiving?.txHash || null
            };

            if (status === LifiSwapStatus.DONE) {
                dstTxData.txStatus = CrossChainTxStatus.SUCCESS;
            }

            if (status === LifiSwapStatus.FAILED) {
                dstTxData.txStatus = CrossChainTxStatus.FAIL;
            }

            if (status === LifiSwapStatus.INVALID) {
                dstTxData.txStatus = CrossChainTxStatus.UNKNOWN;
            }

            if (status === LifiSwapStatus.NOT_FOUND || status === LifiSwapStatus.PENDING) {
                dstTxData.txStatus = CrossChainTxStatus.PENDING;
            }

            return dstTxData;
        } catch (error) {
            console.debug('[Li-fi Trade] error retrieving tx status', error);
            return {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
        }
    }

    /**
     * Get Celer trade dst transaction status.
     * @param data Trade data.
     * @param srcTxReceipt Source transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private async getCelerDstSwapStatus(
        data: CrossChainTradeData,
        srcTxReceipt: TransactionReceipt
    ): Promise<DstTxData> {
        try {
            // Filter undecoded logs.
            const dstTxData = {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
            const [requestLog] = LogsDecoder.decodeLogs(
                celerCrossChainEventStatusesAbi,
                srcTxReceipt
            );
            if (!requestLog) {
                const eightHours = 60 * 60 * 1000 * 8;
                if (!requestLog && Date.now() > data.txTimestamp + eightHours) {
                    dstTxData.txStatus = CrossChainTxStatus.FAIL;
                    // return CrossChainTxStatus.FAIL;
                }
                dstTxData.txStatus = CrossChainTxStatus.PENDING;
            }
            const dstTxStatus = Number(
                await Injector.web3PublicService
                    .getWeb3Public(data.toBlockchain)
                    .callContractMethod(
                        celerCrossChainContractsAddresses[
                            data.toBlockchain as CelerCrossChainSupportedBlockchain
                        ],
                        celerCrossChainContractAbi,
                        'processedTransactions',
                        {
                            methodArguments: [
                                requestLog?.params?.find(param => param.name === 'id')?.value
                            ]
                        }
                    )
            ) as CelerSwapStatus;

            if (dstTxStatus === CelerSwapStatus.NULL) {
                dstTxData.txStatus = CrossChainTxStatus.PENDING;
            }

            if (dstTxStatus === CelerSwapStatus.FAILED) {
                dstTxData.txStatus = CrossChainTxStatus.FAIL;
            }

            if (dstTxStatus === CelerSwapStatus.SUCCESS) {
                dstTxData.txStatus = CrossChainTxStatus.SUCCESS;
            }

            return dstTxData;
        } catch (error) {
            console.debug('[Celer Trade] error retrieving tx status', error);
            return {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
        }
    }

    /**
     * Get Rubic trade dst transaction status.
     * @param data Trade data.
     * @param srcTxReceipt Source transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private async getRubicDstSwapStatus(
        data: CrossChainTradeData,
        srcTxReceipt: TransactionReceipt
    ): Promise<DstTxData> {
        console.log(data, srcTxReceipt);
        return { txStatus: CrossChainTxStatus.PENDING, txHash: null };
    }

    /**
     * Get transaction receipt.
     * @param blockchain Blockchain name.
     * @param txHash Transaction hash.
     * @returns Transaction receipt.
     */
    private async getTxReceipt(
        blockchain: BlockchainName,
        txHash: string
    ): Promise<TransactionReceipt | null> {
        let receipt: TransactionReceipt | null;

        try {
            receipt = await Injector.web3PublicService
                .getWeb3Public(blockchain)
                .getTransactionReceipt(txHash);
        } catch (error) {
            console.debug('Error retrieving src tx receipt', { error, txHash });
            receipt = null;
        }

        return receipt;
    }

    /**
     * Get DeBridge trade dst transaction status.
     * @param _data Trade data.
     * @param srcTxReceipt Source transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private async getDebridgeDstSwapStatus(
        _data: CrossChainTradeData,
        srcTxReceipt: TransactionReceipt
    ): Promise<DstTxData> {
        try {
            const params = { filter: srcTxReceipt.transactionHash, filterType: 1 };
            const { send = null, claim = null } = await this.httpClient.get<DeBridgeApiResponse>(
                'https://api.debridge.finance/api/Transactions/GetFullSubmissionInfo',
                { params }
            );
            const dstTxData: DstTxData = {
                txStatus: CrossChainTxStatus.FAIL,
                txHash: claim?.transactionHash || null
            };

            if (!send || !claim) {
                dstTxData.txStatus = CrossChainTxStatus.PENDING;
            }

            if (claim?.transactionHash) {
                dstTxData.txStatus = CrossChainTxStatus.SUCCESS;
            }

            return dstTxData;
        } catch {
            return {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
        }
    }

    /**
     * Get Via trade dst transaction status.
     * @param data Trade data.
     * @param _srcTxReceipt Source transaction receipt.
     * @returns Cross-chain transaction status.
     */
    private async getViaDstSwapStatus(
        data: CrossChainTradeData,
        _srcTxReceipt: TransactionReceipt
    ): Promise<DstTxData> {
        try {
            const txStatusResponse = await new Via(VIA_DEFAULT_CONFIG).checkTx({
                actionUuid: data.viaUuid!
            });
            const status = txStatusResponse.event as unknown as ViaSwapStatus;
            const dstTxData: DstTxData = {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: txStatusResponse.data?.txHash || null
            };

            if (status === ViaSwapStatus.SUCCESS) {
                dstTxData.txStatus = CrossChainTxStatus.SUCCESS;
            }
            if (status === ViaSwapStatus.FAIL) {
                dstTxData.txStatus = CrossChainTxStatus.FAIL;
            }

            return dstTxData;
        } catch {
            return {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
        }
    }

    /**
     * @internal
     * Get transaction status in bitcoin network;
     * @param hash Bitcoin transaction hash.
     */
    private async getBitcoinStatus(hash: string): Promise<DstTxData> {
        let bitcoinTransactionStatus: BtcStatusResponse;
        const dstTxData: DstTxData = {
            txStatus: CrossChainTxStatus.PENDING,
            txHash: null
        };
        try {
            const btcStatusApi = 'https://blockchain.info/rawtx/';
            bitcoinTransactionStatus = await this.httpClient.get<BtcStatusResponse>(
                `${btcStatusApi}${hash}`
            );
        } catch {
            return {
                txStatus: CrossChainTxStatus.PENDING,
                txHash: null
            };
        }

        const isCompleted = bitcoinTransactionStatus?.block_index !== undefined;
        if (isCompleted) {
            dstTxData.txStatus = CrossChainTxStatus.SUCCESS;
        }

        return dstTxData;
    }
}
