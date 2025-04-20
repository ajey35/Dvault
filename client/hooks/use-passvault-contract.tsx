"use client"

import { useEffect, useState } from "react"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { useToast } from "@/components/ui/use-toast"
import { getContract } from "viem"

// Replace with your actual contract address
const contractAddress = "0x33F9f27d65A9E574F4643884dEFF86156e70b2e4"
// Contract ABI
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_label",
				"type": "string"
			}
		],
		"name": "deletePasswordByLabel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "label",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsCID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PasswordStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "label",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsCID",
				"type": "string"
			}
		],
		"name": "storePassword",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getMyPasswords",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "label",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ipfsCID",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct PassVault.PasswordEntry[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
export function usePassVaultContract() {
  const [contract, setContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { toast } = useToast()

  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !publicClient || !walletClient) {
        setIsLoading(false)
        return
      }

      try {
        // Initialize contract with the contract address and ABI using viem
        const contractInstance = getContract({
          address: contractAddress,
          abi: contractABI,
          client: { public: publicClient, wallet: walletClient },
        })
        console.log("contract",contractInstance);
        
        setContract(contractInstance)
      } catch (error) {
        console.error("Contract initialization error:", error)
        toast({
          title: "Contract Error",
          description: "Could not connect to the smart contract.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initContract()
  }, [isConnected, publicClient, walletClient, toast])

  // Function to interact with the contract (example: storePassword)
  const storePassword = async (label: string, ipfsCid: string) => {
    if (!contract) {
      console.error("Contract is not initialized")
      return
    }

    try {
      // Prepare the contract write operation
      const config = await contract.prepareWrite({
        functionName: "storePassword",
        args: [label, ipfsCid],
      })

      // Write to the contract
      const tx = await contract.write(config)
      console.log("Transaction hash:", tx.hash)

      // Optional: watch the event after the transaction is sent
      contract.watchEvent("PasswordStored", (event: any) => {
        console.log("PasswordStored event:", event)
      })
    } catch (error) {
      console.error("Error storing password:", error)
      toast({
        title: "Transaction Error",
        description: "Failed to store password.",
        variant: "destructive",
      })
    }
  }

  return { contract, isLoading, storePassword }
}

export const wagmiContractConfig = {
	address: '0x33F9f27d65A9E574F4643884dEFF86156e70b2e4',
	abi:contractABI
  } as const