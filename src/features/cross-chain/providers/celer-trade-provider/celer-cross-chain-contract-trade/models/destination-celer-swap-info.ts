import { SwapVersion } from 'src/features/cross-chain/providers/celer-trade-provider/celer-cross-chain-contract-trade/models/provider-type.enum';

export interface DestinationCelerSwapInfo {
    dex: string;
    nativeOut: boolean;
    receiverEOA: string;
    integrator: string;
    version: SwapVersion;
    path: string | string[];
    pathV3: string | string[];
    deadline: number;
    amountOutMinimum: string;
}
