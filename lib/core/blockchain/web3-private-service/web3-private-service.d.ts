import { BlockchainName, EvmBlockchainName, TronBlockchainName } from '../models/blockchain-name';
import { ChainType } from '../models/chain-type';
import { Web3PrivateSupportedBlockchain } from './models/web-private-supported-blockchain';
import { Web3PrivateSupportedChainType } from './models/web-private-supported-chain-type';
import { EvmWeb3Private } from './web3-private/evm-web3-private/evm-web3-private';
import { TronWeb3Private } from './web3-private/tron-web3-private/tron-web3-private';
import { Web3Private } from './web3-private/web3-private';
import { WalletProvider, WalletProviderCore } from '../../sdk/models/wallet-provider';
export declare class Web3PrivateService {
    static isSupportedChainType(chainType: ChainType): chainType is Web3PrivateSupportedChainType;
    private web3PrivateStorage;
    private readonly createWeb3Private;
    constructor(walletProvider?: WalletProvider);
    getWeb3Private(chainType: 'EVM'): EvmWeb3Private;
    getWeb3Private(chainType: 'TRON'): TronWeb3Private;
    getWeb3Private(chainType: ChainType): never;
    getWeb3PrivateByBlockchain(blockchain: EvmBlockchainName): EvmWeb3Private;
    getWeb3PrivateByBlockchain(blockchain: TronBlockchainName): TronWeb3Private;
    getWeb3PrivateByBlockchain(blockchain: Web3PrivateSupportedBlockchain): Web3Private;
    getWeb3PrivateByBlockchain(blockchain: BlockchainName): never;
    private createWeb3PrivateStorage;
    private createEvmWeb3Private;
    private createTronWeb3Private;
    updateWeb3PrivateStorage(walletProvider: WalletProvider): void;
    updateWeb3Private(chainType: Web3PrivateSupportedChainType, walletProviderCore: WalletProviderCore): void;
    updateWeb3PrivateAddress(chainType: Web3PrivateSupportedChainType, address: string): void;
}
