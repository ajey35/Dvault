import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from 'next-themes'; // Assuming you're using Next.js and next-themes for theme management
import '@rainbow-me/rainbowkit/styles.css';

export function CustomConnectButton() {
  const { theme } = useTheme(); // Get current theme (dark or light)
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <Button
        variant="destructive"
        onClick={() => window.location.reload()}
        className="rounded-xl px-6 py-3 text-base font-semibold shadow-md"
      >
        Retry Connection
      </Button>
    );
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="transition-opacity duration-300"
          >
            {!connected ? (
              <Button
                onClick={() => {
                  try {
                    openConnectModal();
                  } catch (err) {
                    console.error("Connect Modal Error:", err);
                    setError(err instanceof Error ? err : new Error("Failed to connect wallet"));
                  }
                }}
                className={`w-full sm:w-auto px-6 py-3 text-base font-bold rounded-xl 
                ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-300 to-purple-300 text-gray-900'}
                shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300`}
              >
                Connect Wallet
              </Button>
            ) : chain.unsupported ? (
              <Button
                onClick={openChainModal}
                variant="destructive"
                className={`w-full sm:w-auto px-6 py-3 text-base font-bold rounded-xl shadow-md
                ${theme === 'dark' ? 'bg-red-700' : 'bg-red-400'} 
                hover:scale-105 transition-transform duration-300`}
              >
                Wrong Network
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={openChainModal}
                  variant="ghost"
                  size="sm"
                  className={`hidden md:inline-flex rounded-lg border ${theme === 'dark' ? 'border-purple-200 text-purple-600' : 'border-purple-500 text-purple-800'} 
                  bg-white/10 backdrop-blur-md hover:bg-white/20 shadow-inner px-4 py-2 transition`}
                >
                  {chain.name}
                </Button>

                <Button
                  onClick={openAccountModal}
                  className={`rounded-xl px-5 py-3 text-base font-medium bg-white/10 text-white hover:bg-white/20 backdrop-blur-lg border border-white/20 shadow-md transition duration-300
                  ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
                >
                  {account.displayName || formatAddress(account.address)}
                </Button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
