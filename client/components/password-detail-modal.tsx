import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { decryptPasswordWithWallet } from "../lib/encryption"
import { useWalletClient } from "wagmi"
import { walletClientToSigner } from "../lib/wallet-to-signer"

import axios from "axios"

interface PasswordEntry {
  id: number
  label: string
  ipfsCID: string
  timestamp: number
}


type PE = PasswordEntry | null

interface PasswordDetailModalProps {
  isOpen: boolean
  onClose: () => void
  passwordEntry: PE
}
export function PasswordDetailModal({ isOpen, onClose, passwordEntry }: PasswordDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [label,setLabel] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const { data: walletClient } = useWalletClient()
  useEffect(() => {
    if (isOpen && passwordEntry) {
      setLabel(passwordEntry.label)
      fetchAndDecryptPassword(passwordEntry.ipfsCID)
    } else {
      // Reset state when modal closes
      setPassword("")
      setIsLoading(false)
      setShowPassword(false)
    }
  }, [isOpen, passwordEntry])
  const fetchAndDecryptPassword = async (cid: string) => {
    if (!walletClient || !passwordEntry) return
  
    setIsLoading(true)
    setPassword("")
  
    try {
      const url = `https://ipfs.io/ipfs/${cid}`
  
      const response = await axios.get(url, { timeout: 7000 }) // optional timeout
  
      let encryptedData: string = response.data
      if (typeof encryptedData !== "string") {
        throw new Error("Invalid data format from IPFS.")
      }

      console.log("label found in decrypt call",label);
      const signer = walletClientToSigner(walletClient)
      const decryptedPassword = await decryptPasswordWithWallet(label,encryptedData, await signer)
      setPassword(decryptedPassword)
    } catch (error) {
      console.error("Error fetching/decrypting password:", error)
      toast({
        title: "Error",
        description: "Failed to decrypt password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  
  const copyToClipboard = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    toast({
      title: "Copied",
      description: "Password copied to clipboard",
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  if (!passwordEntry) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{passwordEntry.label}</DialogTitle>
          <DialogDescription>View your stored password details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" value={passwordEntry.label} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="pr-10"
                  placeholder={isLoading ? "Decrypting..." : ""}
                />
                {isLoading ? (
                  <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-5 w-5 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!password}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                )}
              </div>
              <Button 
                size="icon" 
                variant="outline"
                disabled={isLoading || !password} 
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy password</span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipfs">IPFS CID</Label>
            <Input id="ipfs" value={passwordEntry.ipfsCID} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timestamp">Created At</Label>
            <Input 
              id="timestamp" 
              value={formatDate(passwordEntry.timestamp)} 
              readOnly 
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}