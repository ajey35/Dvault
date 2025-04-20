import { WalletClient } from "viem"
import { ethers } from "ethers"

export async function walletClientToSigner(walletClient: WalletClient) {
  if (!walletClient) {
    throw new Error("walletClient is required")
  }

  // Cast viem WalletClient to EIP-1193 compatible provider
  const eip1193Provider = walletClient as any

  // Create ethers v6 provider
  const provider = new ethers.BrowserProvider(eip1193Provider)

  // Get the signer
  const signer = await provider.getSigner()
  return signer
}
