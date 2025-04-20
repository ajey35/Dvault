"use client"

import { DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle, CheckCircle, Loader } from "lucide-react"
import { motion } from "framer-motion"

export function WalletModal() {
  return (
    <DialogContent className="bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-2xl max-w-md p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 w-max p-3 rounded-2xl">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
            Connect Wallet
          </h2>
          <p className="text-gray-300">Choose your preferred wallet provider</p>
        </div>

        {/* Error Alert */}
        <div className="bg-red-900/30 p-4 rounded-xl border border-red-400/30 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-sm text-red-300">2 connection issues detected</span>
        </div>

        {/* Wallet List */}
        <div className="space-y-4">
          {/* Installed Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Installed
            </h3>
            <div className="space-y-2">
              {['MetaMask', 'Brave Wallet'].map((wallet, i) => (
                <motion.div
                  key={wallet}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Button
                    className="w-full justify-start gap-4 px-6 py-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <img 
                      src={`/${wallet.toLowerCase()}-icon.svg`} 
                      alt={wallet}
                      className="h-6 w-6"
                    />
                    <span className="font-medium">{wallet}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-400">Installed</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Recent
            </h3>
            <div className="space-y-2">
              {['Phantom'].map((wallet, i) => (
                <motion.div
                  key={wallet}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Button
                    className="w-full justify-start gap-4 px-6 py-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <img 
                      src={`/${wallet.toLowerCase()}-icon.svg`} 
                      alt={wallet}
                      className="h-6 w-6"
                    />
                    <span className="font-medium">{wallet}</span>
                    <span className="ml-auto text-sm text-purple-400">Recent</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Loader className="h-4 w-4 animate-spin" />
          <span className="text-sm">Checking available wallets...</span>
        </div>
      </div>
    </DialogContent>
  )
}