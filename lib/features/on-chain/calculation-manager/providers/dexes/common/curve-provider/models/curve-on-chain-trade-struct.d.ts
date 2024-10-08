import { EvmOnChainTradeStruct } from '../../../../common/on-chain-trade/evm-on-chain-trade/models/evm-on-chain-trade-struct';
export interface CurveOnChainTradeStruct extends EvmOnChainTradeStruct {
    poolAddress: string;
    registryExchangeAddress: string;
}
