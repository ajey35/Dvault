"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { encryptPasswordWithWallet } from "@/lib/encryption"
import { usePassVaultContract } from "@/hooks/use-passvault-contract"
import { useAccount, useWalletClient } from "wagmi"
import axios from "axios"
import { walletClientToSigner } from "../lib/wallet-to-signer"

export function AddPassword() {
  const [label, setLabel] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { contract } = usePassVaultContract()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!label || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in both label and password fields.",
        variant: "destructive",
      })
      return
    }

    if (!contract || !walletClient || !address) {
      toast({
        title: "Wallet or Contract Error",
        description: "Make sure your wallet is connected and the contract is ready.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Step 1: Encrypt password with wallet
       console.log("walletcleint",walletClient)
       const signer = walletClientToSigner(walletClient)
       console.log("signer",signer);
       
      const encryptedPassword = await encryptPasswordWithWallet(label,password,await signer)

      // Step 2: Upload encrypted password to Pinata
      const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY!
      const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!
      const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS"

      const file = new File([encryptedPassword], `password-${Date.now()}.txt`, {
        type: "text/plain",
      })

      const formData = new FormData()
      formData.append("file", file)

      const headers = {
        "pinata_api_key": pinataApiKey,
        "pinata_secret_api_key": pinataSecretApiKey,
      }

      const response = await axios.post(pinataUrl, formData, { headers })
      const { IpfsHash } = response.data
      const fullUrl = IpfsHash

      // Step 3: Store on-chain
      await contract.write.storePassword([label, fullUrl])

      toast({
        title: "Success",
        description: (
          <div className="space-y-1">
            <p>Password stored successfully!</p>
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Encrypted Password on IPFS
            </a>
          </div>
        ),
      })

      setLabel("")
      setPassword("")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to store password",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add Password</h2>
        <p className="text-muted-foreground">
          Store a new password securely on the blockchain.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-md border border-muted rounded-xl">
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>
              Your password will be encrypted before being stored.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., Gmail, Facebook, Instagram"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Storing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Store Password
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">How it works</h3>
        <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
          <li>Your password is encrypted in your browser using your wallet</li>
          <li>The encrypted password is uploaded to IPFS</li>
          <li>The IPFS CID and label are saved on the blockchain</li>
          <li>Only your wallet can decrypt and access it</li>
        </ol>
      </div>
    </div>
  )
}
