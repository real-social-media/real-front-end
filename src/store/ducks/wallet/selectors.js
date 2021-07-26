/**
 *
 */
export const walletGet = (state) => state?.wallet?.walletGet
export const walletTotal = (state) => walletGet(state)?.data?.total
