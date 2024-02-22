import { PathrSdkError } from "../pathr-sdk.error";
/**
 * Thrown, when method, which requires connected wallet, is called without
 * wallet being connected.
 */
export declare class WalletNotConnectedError extends PathrSdkError {
    constructor();
}
