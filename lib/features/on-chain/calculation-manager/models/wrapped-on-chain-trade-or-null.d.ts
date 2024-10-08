import { RubicSdkError } from '../../../../common/errors';
import { OnChainTradeType } from '../providers/common/models/on-chain-trade-type';
import { OnChainTrade } from '../providers/common/on-chain-trade/on-chain-trade';
export type WrappedOnChainTradeOrNull = {
    /**
     * Calculated cross-chain trade.
     * Sometimes trade can be calculated even if error was thrown.
     * Equals `null` in case error is critical and trade cannot be calculated.
     */
    trade: OnChainTrade | null;
    /**
     * Type of calculated trade.
     */
    tradeType: OnChainTradeType;
    /**
     * Error, thrown during calculation.
     */
    error?: RubicSdkError;
} | null;
