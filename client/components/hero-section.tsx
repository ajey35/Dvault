"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Shield, Lock, Key, Database, 
  Fingerprint, Globe, Rocket, BadgeCheck,
  BarChart, InfinityIcon, Server, Wallet, ChevronRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const router = useRouter()
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 bg-[url('/grid.svg')] opacity-20"
        style={{ rotate, scale }}
      />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            initial={{
              scale: 0,
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%"
            }}
            animate={{
              scale: [0, Math.random() * 0.5 + 0.5, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: `${Math.random() * 40 + 10}px`,
              height: `${Math.random() * 40 + 10}px`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Header */}
      <header className="fixed w-full top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-slate-900/80">
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
              SecureVault
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4"
          >
            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/5 rounded-xl"
                onClick={() => router.push("/features")}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/5 rounded-xl"
                onClick={() => router.push("/pricing")}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/5 rounded-xl"
                onClick={() => router.push("/about")}
              >
                Company
              </Button>
            </nav>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl gap-2"
              onClick={openConnectModal}
            >
              <Wallet className="h-5 w-5" />
              {isConnected ? "Dashboard" : "Get Started"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <main className="relative pt-32 pb-24">
        <section className="container px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="flex flex-col lg:flex-row items-center gap-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex-1 space-y-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm w-fit"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <Rocket className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium">Next-Gen Security Platform</span>
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
                  Blockchain-Powered
                  <br />
                  Password Management
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl">
                  Secure your digital life with military-grade encryption and decentralized storage
                  powered by Ethereum & IPFS network.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl gap-2"
                    onClick={openConnectModal}
                  >
                    Start Free Trial
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 hover:bg-white/5 rounded-xl gap-2"
                  >
                    Watch Product Tour
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M10 16.5l6-4.5-6-4.5v9z"/>
                    </svg>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-6 mt-12">
                  {['Trusted by 50k+ Users', '99.99% Uptime', '256-bit Encryption'].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
                      <BadgeCheck className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Vault Preview */}
              <motion.div
                className="relative w-full max-w-2xl aspect-square"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                 {/* Interactive Vault Preview */}
              <motion.div
                className="relative w-full max-w-lg aspect-square"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
                <div className="relative h-full bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden">
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <Lock className="h-6 w-6 text-blue-400" />
                      <div className="h-4 bg-white/10 rounded-full w-32" />
                    </div>
                    
                    {[...Array(3)].map((_, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        whileHover={{ x: 10 }}
                      >
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
                          {i === 0 && <Globe className="h-5 w-5 text-blue-400" />}
                          {i === 1 && <Key className="h-5 w-5 text-purple-400" />}
                          {i === 2 && <Database className="h-5 w-5 text-green-400" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-white/20 rounded-full w-3/4" />
                          <div className="h-2 bg-white/10 rounded-full w-1/2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features Grid */}
        <section className="container px-4 md:px-6 mt-32">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Fingerprint,
                title: "Biometric Authentication",
                desc: "Secure access with face/fingerprint recognition",
                gradient: "from-green-400 to-cyan-400"
              },
              {
                icon: Globe,
                title: "Global Network",
                desc: "Distributed across 200+ IPFS nodes worldwide",
                gradient: "from-blue-400 to-purple-400"
              },
              {
                icon: InfinityIcon,
                title: "Unlimited Storage",
                desc: "Store unlimited passwords and secure notes",
                gradient: "from-purple-400 to-pink-400"
              },
              {
                icon: BarChart,
                title: "Real-time Monitoring",
                desc: "24/7 security dashboard and activity logs",
                gradient: "from-orange-400 to-red-400"
              },
              {
                icon: Server,
                title: "Auto Backup",
                desc: "Automatic encrypted backups every 24 hours",
                gradient: "from-yellow-400 to-amber-400"
              },
              {
                icon: BadgeCheck,
                title: "Insurance Protected",
                desc: "$1M protection against security breaches",
                gradient: "from-cyan-400 to-blue-400"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className={cn(
                  "p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl",
                  "hover:border-transparent transition-all group relative overflow-hidden"
                )}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`absolute -inset-px bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity`} />
                <feature.icon className={`h-10 w-10 mb-6 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
                <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="container px-4 md:px-6 mt-32">
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 backdrop-blur-xl border border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: "1M+", label: "Protected Accounts", color: "from-green-400 to-cyan-400" },
                { value: "99.99%", label: "Uptime Guarantee", color: "from-blue-400 to-purple-400" },
                { value: "256-bit", label: "Military Encryption", color: "from-purple-400 to-pink-400" },
                { value: "24/7", label: "Security Monitoring", color: "from-cyan-400 to-blue-400" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="p-6"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="mt-2 text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">D Vault</span>
              </div>
              <p className="text-gray-300">
                Next-generation decentralized security platform
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Product</h4>
              <nav className="space-y-2">
                {['Features', 'Security', 'Pricing', 'FAQ'].map((item, i) => (
                  <a key={i} className="block text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <nav className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item, i) => (
                  <a key={i} className="block text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Stay Updated</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-xl hover:bg-white/5">
                  <TwitterIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl hover:bg-white/5">
                  <GitHubIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl hover:bg-white/5">
                  <DiscordIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-300">
            © {new Date().getFullYear()} D Vault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// Keep the icon components from previous answer

// Add these icon components
function TwitterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function GitHubIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function DiscordIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}