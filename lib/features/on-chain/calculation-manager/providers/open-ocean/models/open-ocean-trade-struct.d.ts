import BigNumber from 'bignumber.js';
import { EvmOnChainTradeStruct } from '../../common/on-chain-trade/evm-on-chain-trade/models/evm-on-chain-trade-struct';
export interface OpenOceanTradeStruct extends EvmOnChainTradeStruct {
    toTokenWeiAmountMin: BigNumber;
}
