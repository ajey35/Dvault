import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, Trash } from "lucide-react"
import { motion } from "framer-motion"
import { PasswordDetailModal } from "@/components/password-detail-modal"
import { useToast } from "@/components/ui/use-toast"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { wagmiContractConfig } from "@/hooks/use-passvault-contract"
import { Address } from "viem"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RawPasswordEntry {
  label: string
  ipfsCID: string
  timestamp: bigint
}

interface PasswordEntry {
  id: number
  label: string
  ipfsCID: string
  timestamp: number
}

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [passwordToDelete, setPasswordToDelete] = useState<PasswordEntry | null>(null)
  const router = useRouter()
  
  const { toast } = useToast()
  const { address } = useAccount()
  const { writeContract, isPending: isDeleting } = useWriteContract()
  const queryClient = useQueryClient()

  const {
    data: fetchedPasswords,
    isLoading,
    isError,
  } = useReadContract(
    address
      ? {
          ...wagmiContractConfig,
          functionName: "getMyPasswords",
          args: [address],
        }
      : undefined
  )

  useEffect(() => {
    if (!fetchedPasswords) return

    try {
      const passwordEntries = (fetchedPasswords as RawPasswordEntry[])
        .map((entry, index): PasswordEntry => ({
          id: index,
          label: entry.label,
          ipfsCID: entry.ipfsCID,
          timestamp: Number(entry.timestamp),
        }))
        // Filter out default/empty values
        .filter(entry => 
          entry.label.trim() !== "" && 
          entry.ipfsCID.trim() !== "" && 
          entry.timestamp !== 0
        )

      setPasswords(passwordEntries.sort((a, b) => b.timestamp - a.timestamp))
    } catch (error) {
      console.error("Error processing passwords:", error)
      toast({
        title: "Error",
        description: "Failed to process your passwords.",
        variant: "destructive",
      })
      setPasswords([])
    }
  }, [fetchedPasswords, toast])

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to fetch your passwords. Please try again.",
        variant: "destructive",
      })
    }
  }, [isError, toast])

  const handleDeletePassword = (password: PasswordEntry) => {
    writeContract({
      ...wagmiContractConfig,
      functionName: "deletePasswordByLabel",
      args: [address as Address, password.label],
    }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Password deleted successfully" })
        queryClient.invalidateQueries({ queryKey: ["passwords", address] })
        setPasswordToDelete(null)
        router.refresh()
      
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    })
  }

  const filteredPasswords = passwords.filter((password) =>
    password.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewPassword = (password: PasswordEntry) => {
    setSelectedPassword(password)
    setIsModalOpen(true)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search passwords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your passwords...</p>
          </div>
        </div>
      ) : filteredPasswords.length === 0  ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center md:p-8">
          <div className="mx-auto max-w-[420px] space-y-2">
            <h3 className="text-lg font-semibold">No passwords found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No passwords match your search." : "You haven't added any passwords yet."}
            </p>
            {!searchQuery && (
              <Button className="mt-4" onClick={() => (window.location.hash = "#add")}>
                Add your first password
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPasswords.map((password, index) => (
            <motion.div
              key={password.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="truncate text-base md:text-lg">{password.label}</CardTitle>
                  <CardDescription className="truncate text-xs md:text-sm">
                    Added on {formatDate(password.timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="h-2 w-full rounded-full bg-muted md:h-3">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-primary/60" />
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full text-sm md:text-base"
                    onClick={() => handleViewPassword(password)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="text-sm md:text-base"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{password.label}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeletePassword(password)}
                          disabled={isDeleting}
                        >
                          {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {isDeleting ? "Deleting..." : "Confirm Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <PasswordDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        passwordEntry={selectedPassword}
      />
    </div>
  )
}