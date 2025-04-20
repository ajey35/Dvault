import CryptoJS from "crypto-js"
import { Signer } from "ethers"


export async function encryptPasswordWithWallet(
  label: string,
  password: string,
  signer: Signer
): Promise<string> {
  // Sign the label to generate a signature
  const signature = await signer.signMessage(label)
  
  console.log("Signature for label:", signature)

  // Derive the encryption key from the signature using SHA256
  const key = CryptoJS.SHA256(signature).toString()
  
  console.log("Decryption key:", key)

  // Encrypt the password using AES with the derived key
  return CryptoJS.AES.encrypt(password, key).toString()
  
}

export async function decryptPasswordWithWallet(
  label: string,
  encryptedPassword: string,
  signer: Signer
): Promise<string> {
  try {
    // Sign the label again to generate the same signature
    const signature = await signer.signMessage(label)
    console.log("Signature for label:", signature)

    // Derive the decryption key from the signature using SHA256
    const key = CryptoJS.SHA256(signature).toString()
    console.log("Decryption key:", key)

    // Decrypt the encrypted password using AES with the derived key
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, key)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    console.log("Decrypted password:", decrypted)

    // If the decrypted result is empty or invalid, throw an error
    if (!decrypted) throw new Error("Invalid password or signature")

    return decrypted
  } catch (error) {
    console.error("Error during decryption:", error)
    throw error
  }
}

