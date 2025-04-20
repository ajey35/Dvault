"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { formatAddress } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Download, Save, Moon, Sun, Fingerprint, Bell, Lock, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function Settings() {
  const [autoLock, setAutoLock] = useState(true)
  const [autoLockTime, setAutoLockTime] = useState(5)
  const [biometricAuth, setBiometricAuth] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [encryptionLevel, setEncryptionLevel] = useState("high")
  const [showSecurityAlert, setShowSecurityAlert] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const { address } = useAccount()

  // Check system theme preference on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(isDarkMode)
    }
  }, [])

  // Apply theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleSave = () => {
    setIsLoading(true)
    // Simulate saving to server
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      })
    }, 800)
  }

  const handleExport = () => {
    setIsLoading(true)
    toast({
      title: "Export Initiated",
      description: "Your encrypted passwords will be downloaded shortly.",
    })

    // In a real app, you would implement the export functionality here
    setTimeout(() => {
      setIsLoading(false)
      const element = document.createElement("a")
      const file = new Blob([JSON.stringify({ message: "This would be your encrypted passwords" })], {
        type: "application/json",
      })
      element.href = URL.createObjectURL(file)
      element.download = "passvault-backup.json"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 1000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and security settings.</p>
      </motion.div>

      {showSecurityAlert && (
        <motion.div variants={itemVariants} className="mb-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Security Recommendation</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>Enable biometric authentication for an additional layer of security.</span>
              <Button variant="outline" size="sm" onClick={() => setShowSecurityAlert(false)}>Dismiss</Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <motion.div 
            className="grid gap-6 md:grid-cols-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your wallet and account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label>Wallet Address</Label>
                    <div className="rounded-md bg-muted p-2 text-sm font-mono flex justify-between items-center">
                      <span>{address ? formatAddress(address) : "Not connected"}</span>
                      {address && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                          navigator.clipboard.writeText(address)
                          toast({
                            title: "Address Copied",
                            description: "Wallet address copied to clipboard",
                          })
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Connected Network</Label>
                    <Select defaultValue="ethereum">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Account Type</Label>
                    <div className="rounded-md bg-muted p-2 text-sm">Premium</div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center" 
                    onClick={handleExport}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Export Passwords
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Account History</CardTitle>
                  <CardDescription>View your recent activities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { date: "April 18, 2025", action: "Password updated", site: "amazon.com" },
                      { date: "April 15, 2025", action: "New login saved", site: "netflix.com" },
                      { date: "April 10, 2025", action: "Account settings changed", site: "System" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b pb-2">
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-muted-foreground">{item.site}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div 
            className="grid gap-6 md:grid-cols-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your security preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-lock">Auto-Lock</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically lock after {autoLockTime} minutes of inactivity
                        </p>
                      </div>
                      <Switch id="auto-lock" checked={autoLock} onCheckedChange={setAutoLock} />
                    </div>

                    {autoLock && (
                      <div className="pt-2 pl-1 pr-1">
                        <Label htmlFor="auto-lock-time" className="mb-2 block text-xs">
                          Lock Time: {autoLockTime} minute{autoLockTime !== 1 ? 's' : ''}
                        </Label>
                        <Slider
                          id="auto-lock-time"
                          defaultValue={[autoLockTime]}
                          max={30}
                          min={1}
                          step={1}
                          onValueChange={(value) => setAutoLockTime(value[0])}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="biometric" className="flex items-center">
                          <Fingerprint className="mr-1 h-4 w-4" />
                          Biometric Authentication
                        </Label>
                        <p className="text-xs text-muted-foreground">Use fingerprint or face ID to unlock</p>
                      </div>
                      <Switch id="biometric" checked={biometricAuth} onCheckedChange={setBiometricAuth} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="encryption-level">Encryption Level</Label>
                      <Select defaultValue={encryptionLevel} onValueChange={setEncryptionLevel}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select encryption level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (AES-128)</SelectItem>
                          <SelectItem value="high">High (AES-256)</SelectItem>
                          <SelectItem value="maximum">Maximum (AES-256 + Argon2)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher encryption levels provide better security but may affect performance
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full flex items-center justify-center" 
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Shield className="mr-2 h-4 w-4" />
                    )}
                    Save Security Settings
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Security Checkup</CardTitle>
                  <CardDescription>Review your account security status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-900">
                          Strong
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-600">
                          85%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { title: "Strong Password", status: "Complete", icon: "✓", color: "text-green-500" },
                      { title: "Biometric Authentication", status: biometricAuth ? "Enabled" : "Disabled", icon: biometricAuth ? "✓" : "✗", color: biometricAuth ? "text-green-500" : "text-amber-500" },
                      { title: "Two-Factor Authentication", status: "Not Set Up", icon: "✗", color: "text-red-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span>{item.title}</span>
                        <span className={`font-medium ${item.color}`}>{item.icon} {item.status}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Run Security Checkup
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences">
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize your application experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications" className="flex items-center">
                          <Bell className="mr-1 h-4 w-4" />
                          Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">Receive security alerts and updates</p>
                      </div>
                      <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode" className="flex items-center">
                          {darkMode ? (
                            <Moon className="mr-1 h-4 w-4" />
                          ) : (
                            <Sun className="mr-1 h-4 w-4" />
                          )}
                          {darkMode ? "Dark Mode" : "Light Mode"}
                        </Label>
                        <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
                      </div>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                          <SelectItem value="eth">ETH (Ξ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full flex items-center justify-center" 
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <div className="text-sm uppercase tracking-wider mb-1">Current Plan</div>
                    <div className="text-2xl font-bold mb-1">Premium</div>
                    <div className="text-xs opacity-80">Renews on May 19, 2025</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Features included:</h4>
                    <ul className="space-y-1">
                      {[
                        "Unlimited password storage",
                        "Advanced encryption",
                        "Cross-device sync",
                        "Priority support"
                      ].map((feature, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}