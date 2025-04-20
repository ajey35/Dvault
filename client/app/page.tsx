import { AppShell } from "@/components/app-shell"
import { HeroSection } from "@/components/hero-section"
import { WalletCheck } from "@/components/wallet-check"
export default function Home() {
  return (
    <WalletCheck fallback={<HeroSection />}>
        <AppShell />
    </WalletCheck>
  )
}
