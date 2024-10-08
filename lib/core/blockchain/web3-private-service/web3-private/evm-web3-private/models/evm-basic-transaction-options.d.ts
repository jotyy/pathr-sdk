import BigNumber from 'bignumber.js';
import { BasicTransactionOptions } from '../../models/basic-transaction-options';
import { EIP1559Gas, SingleGasPrice } from '../../../../web3-public-service/web3-public/evm-web3-public/models/gas-price';
export interface EvmBasicTransactionOptions extends BasicTransactionOptions {
    /**
     * Transaction gas limit.
     */
    gas?: BigNumber | string | number;
    /**
     * @deprecated Use gasPriceOptions instead.
     * Transaction gas price.
     */
    gasPrice?: BigNumber | string | number;
    /**
     * Transaction gas price options.
     */
    gasPriceOptions?: EIP1559Gas | SingleGasPrice;
}
