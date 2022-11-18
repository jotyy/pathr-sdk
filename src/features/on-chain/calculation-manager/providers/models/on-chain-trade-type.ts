/**
 * List of on-chain trade types.
 */
export const ON_CHAIN_TRADE_TYPE = {
    ACRYPTOS: 'ACRYPTOS',
    ALDRIN_EXCHANGE: 'ALDRIN_EXCHANGE',
    ALGEBRA: 'ALGEBRA',
    ANNEX: 'ANNEX',
    APE_SWAP: 'APE_SWAP',
    ARTH_SWAP: 'ARTH_SWAP',
    AURORA_SWAP: 'AURORA_SWAP',

    BABY_SWAP: 'BABY_SWAP',
    BALANCER: 'BALANCER',
    BEAM_SWAP: 'BEAM_SWAP',
    BI_SWAP: 'BI_SWAP',
    BRIDGERS: 'BRIDGERS',

    CREMA_FINANCE: 'CREMA_FINANCE',
    CRONA_SWAP: 'CRONA_SWAP',
    CROPPER_FINANCE: 'CROPPER_FINANCE',
    CROW_FI: 'CROW_FI',
    CRO_DEX: 'CRO_DEX',
    CURVE: 'CURVE',

    DEFI_PLAZA: 'DEFI_PLAZA',
    DEFI_SWAP: 'DEFI_SWAP',
    DFYN: 'DFYN',
    DODO: 'DODO',
    DYSTOPIA: 'DYSTOPIA',

    ELK: 'ELK',

    HONEY_SWAP: 'HONEY_SWAP',

    JET_SWAP: 'JET_SWAP',
    JOE: 'JOE',
    JUPITER: 'JUPITER',
    JUPITER_SWAP: 'JUPITER_SWAP',
    J_SWAP: 'J_SWAP',

    KYBER_SWAP: 'KYBER_SWAP',

    LUA_SWAP: 'LUA_SWAP',

    MAVERICK: 'MAVERICK',
    MDEX: 'MDEX',
    MESH_SWAP: 'MESH_SWAP',
    MM_FINANCE: 'MM_FINANCE',
    MOJITO_SWAP: 'MOJITO_SWAP',

    NET_SWAP: 'NET_SWAP',

    ONE_INCH: 'ONE_INCH',
    ONE_MOON: 'ONE_MOON',
    ONE_SOL: 'ONE_SOL',
    OMNIDEX: 'OMNIDEX',
    OOLONG_SWAP: 'OOLONG_SWAP',
    OPEN_OCEAN: 'OPEN_OCEAN',
    ORCA_SWAP: 'ORCA_SWAP',
    OSMOSIS_SWAP: 'OSMOSIS_SWAP',

    PANCAKE_SWAP: 'PANCAKE_SWAP',
    PANGOLIN: 'PANGOLIN',
    PARA_SWAP: 'PARA_SWAP',
    PHOTON_SWAP: 'PHOTON_SWAP',
    POLYDEX: 'POLYDEX',

    QUICK_SWAP: 'QUICK_SWAP',
    QUICK_SWAP_V3: 'QUICK_SWAP_V3',

    RAYDIUM: 'RAYDIUM',
    REF_FINANCE: 'REF_FINANCE',
    REN_BTC: 'REN_BTC',

    SABER_STABLE_SWAP: 'SABER_STABLE_SWAP',
    SAROS_SWAP: 'SAROS_SWAP',
    SERUM: 'SERUM',
    SHIBA_SWAP: 'SHIBA_SWAP',
    SMOOTHY: 'SMOOTHY',
    SOLAR_BEAM: 'SOLAR_BEAM',
    SPIRIT_SWAP: 'SPIRIT_SWAP',
    SPL_TOKEN_SWAP: 'SPL_TOKEN_SWAP',
    SPOOKY_SWAP: 'SPOOKY_SWAP',
    SOUL_SWAP: 'SOUL_SWAP',
    STELLA_SWAP: 'STELLA_SWAP',
    SURFDEX: 'SURFDEX',
    SUSHI_SWAP: 'SUSHI_SWAP',

    TRISOLARIS: 'TRISOLARIS',

    UBE_SWAP: 'UBE_SWAP',
    UNISWAP_V2: 'UNISWAP_V2',
    UNI_SWAP_V3: 'UNI_SWAP_V3',

    VIPER_SWAP: 'VIPER_SWAP',
    VOLTAGE_SWAP: 'VOLTAGE_SWAP',
    VVS_FINANCE: 'VVS_FINANCE',

    WANNA_SWAP: 'WANNA_SWAP',
    WAULT_SWAP: 'WAULT_SWAP',
    WOO_FI: 'WOO_FI',
    WRAPPED: 'WRAPPED',

    ZAPPY: 'ZAPPY',
    ZIP_SWAP: 'ZIP_SWAP',
    ZRX: 'ZRX',

    YUZU_SWAP: 'YUZU_SWAP'
} as const;

/**
 * On-chain trade type.
 */
export type OnChainTradeType = keyof typeof ON_CHAIN_TRADE_TYPE;
