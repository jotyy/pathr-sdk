import { Any } from '../../../common/utils/types';
import { TronWeb } from '../../blockchain/constants/tron/tron-web';
import { CHAIN_TYPE } from '../../blockchain/models/chain-type';
import Web3 from 'web3';
import { provider } from 'web3-core';
export interface WalletProviderCore<T = Any> {
    /**
     * Core provider.
     */
    readonly core: T;
    /**
     * User wallet address.
     */
    readonly address: string;
}
export type EvmWalletProviderCore = WalletProviderCore<provider | Web3>;
export type TronWalletProviderCore = WalletProviderCore<typeof TronWeb>;
/**
 * Stores wallet core and information about current user, used to make `send` transactions.
 */
interface IWalletProvider {
    readonly [CHAIN_TYPE.EVM]?: EvmWalletProviderCore;
    readonly [CHAIN_TYPE.TRON]?: TronWalletProviderCore;
}
export type WalletProvider = Partial<IWalletProvider>;
export {};
