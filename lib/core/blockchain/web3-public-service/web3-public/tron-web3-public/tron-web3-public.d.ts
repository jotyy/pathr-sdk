import BigNumber from 'bignumber.js';
import { TronWeb } from 'src/core/blockchain/constants/tron/tron-web';
import { Web3PrimitiveType } from 'src/core/blockchain/models/web3-primitive-type';
import { ContractMulticallResponse } from 'src/core/blockchain/web3-public-service/web3-public/models/contract-multicall-response';
import { MethodData } from 'src/core/blockchain/web3-public-service/web3-public/models/method-data';
import { TxStatus } from 'src/core/blockchain/web3-public-service/web3-public/models/tx-status';
import { TronBlock } from 'src/core/blockchain/web3-public-service/web3-public/tron-web3-public/models/tron-block';
import { TronTransactionInfo } from 'src/core/blockchain/web3-public-service/web3-public/tron-web3-public/models/tron-transaction-info';
import { TronWebProvider } from 'src/core/blockchain/web3-public-service/web3-public/tron-web3-public/models/tron-web-provider';
import { Web3Public } from 'src/core/blockchain/web3-public-service/web3-public/web3-public';
import { AbiItem } from 'web3-utils';
export declare class TronWeb3Public extends Web3Public {
    private readonly tronWeb;
    protected readonly tokenContractAbi: AbiItem[];
    constructor(tronWeb: typeof TronWeb);
    setProvider(provider: TronWebProvider): void;
    convertTronAddressToHex(address: string): Promise<string>;
    healthCheck(timeoutMs?: number): Promise<boolean>;
    getBalance(userAddress: string, tokenAddress?: string): Promise<BigNumber>;
    getTokenBalance(userAddress: string, tokenAddress: string): Promise<BigNumber>;
    getAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string): Promise<BigNumber>;
    multicallContractsMethods<Output extends Web3PrimitiveType>(contractAbi: AbiItem[], contractsData: {
        contractAddress: string;
        methodsData: MethodData[];
    }[]): Promise<ContractMulticallResponse<Output>[][]>;
    /**
     * Executes multiple calls in the single contract call.
     * @param calls Multicall calls data list.
     * @returns Result of calls execution.
     */
    private multicall;
    callContractMethod<T extends Web3PrimitiveType = string>(contractAddress: string, contractAbi: AbiItem[], methodName: string, methodArguments?: unknown[]): Promise<T>;
    /**
     * Gets mined transaction info.
     * @param hash Transaction hash.
     */
    getTransactionInfo(hash: string): Promise<TronTransactionInfo>;
    getTransactionStatus(hash: string): Promise<TxStatus>;
    getBlock(): Promise<TronBlock>;
    getBlockNumber(): Promise<number>;
}
