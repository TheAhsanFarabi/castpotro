"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle } from "lucide-react";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains"; 
import { saveCertHash } from "@/app/actions/profile";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const CONTRACT_ABI = [
  {
    inputs: [{ name: "to", type: "address" }],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function MintCertificateButton({ enrollmentId }: { enrollmentId: string }) {
  const [status, setStatus] = useState<"idle" | "minting" | "success">("idle");
  const [txHash, setTxHash] = useState("");

  const handleMint = async () => {
    // 1. Check if MetaMask is installed
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    setStatus("minting");

    try {
      // 2. Initialize Client (Without forcing chain yet)
      const client = createWalletClient({
        transport: custom(window.ethereum),
      });

      const [address] = await client.requestAddresses();

      // 3. FORCE SWITCH TO SEPOLIA
      try {
        await client.switchChain({ id: sepolia.id });
      } catch (switchError: any) {
        console.error("Failed to switch chain:", switchError);
        alert("Please switch your MetaMask network to Sepolia.");
        setStatus("idle");
        return;
      }

      // 4. Re-initialize Client with Sepolia
      const sepoliaClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      // 5. Send Transaction (WITH MANUAL GAS LIMIT)
      const hash = await sepoliaClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeMint",
        args: [address],
        account: address,
        gas: BigInt(300000), // <--- FIXED: Manually set gas limit to 300k
      });

      console.log("Tx Hash:", hash);
      setTxHash(hash);

      // 6. Save to Database
      await saveCertHash(enrollmentId, hash);

      setStatus("success");
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "Unknown error";
      
      // Handle Reverts
      if (msg.includes("User denied")) {
         alert("Transaction rejected.");
      } else if (msg.includes("reverted")) {
         alert("Transaction Failed! Are you using the OWNER wallet? Only the contract deployer can mint.");
      } else {
         alert(`Minting failed: ${msg}`);
      }
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <a
        href={`https://sepolia.etherscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
      >
        <CheckCircle size={12} /> View on Blockchain
      </a>
    );
  }

  return (
    <button
      onClick={handleMint}
      disabled={status === "minting"}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 transition shadow-lg shadow-slate-300/50 disabled:opacity-50"
    >
      {status === "minting" ? (
        <>
          <Loader2 size={12} className="animate-spin" /> Minting...
        </>
      ) : (
        <>
          <Zap size={12} fill="currentColor" className="text-yellow-400" /> Mint NFT
        </>
      )}
    </button>
  );
}