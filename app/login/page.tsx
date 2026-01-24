"use client";
import Link from "next/link";
import Image from "next/image"; // Import Image
import { Loader2 } from "lucide-react"; // Removed Zap
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions";

const initialState = {
  message: '',
  success: false,
  redirectUrl: ''
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state?.success && state?.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-transparent relative">
      <div className="w-full flex justify-end p-4 absolute top-0 z-20">
        <Link href="/register">
          <button className="btn-primary py-2 px-6 text-sm border-b-4">
            Sign Up
          </button>
        </Link>
      </div>

      <div className="w-full flex justify-center mt-8 mb-8 relative z-10">
         <Link href="/" className="text-4xl font-extrabold text-[#0ea5e9] tracking-tighter flex items-center gap-4">
            {/* Updated Logo: 70px */}
            <Image 
              src="/icon.png" 
              alt="Castpotro Logo" 
              width={70} 
              height={70} 
              className="object-contain"
            />
            castpotro
         </Link>
      </div>

      <div className="w-full max-w-[375px] flex flex-col gap-6 text-center relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-[32px] border-2 border-slate-100 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-700">Log in</h2>
        
        <form className="flex flex-col gap-4" action={formAction}>
          <input type="email" name="email" placeholder="Email" className="input-field" required />
          <div className="relative">
             <input type="password" name="password" placeholder="Password" className="input-field" required />
             <div className="absolute right-4 top-4 text-slate-400 text-sm font-bold tracking-wider cursor-pointer hover:text-slate-300 uppercase">
                Forgot?
             </div>
          </div>
          
          {state?.message && !state.success && (
             <p className="text-red-500 text-sm font-bold animate-pulse">{state.message}</p>
          )}

          <button disabled={isPending || state?.success} className="btn-primary w-full py-3 text-lg mt-2 shadow-lg shadow-sky-100 disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending || state?.success ? <Loader2 className="animate-spin" /> : null}
            {isPending ? 'Logging in...' : state?.success ? 'Redirecting...' : 'Log in'}
          </button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <div className="h-[2px] bg-slate-100 flex-1"></div>
          <span className="text-slate-300 font-bold text-sm uppercase">or</span>
          <div className="h-[2px] bg-slate-100 flex-1"></div>
        </div>

        <div className="flex gap-4 justify-center">
            <button type="button" className="btn-outline w-full py-3 flex items-center justify-center gap-2 text-[#3b5998]">
               Facebook
            </button>
             <button type="button" className="btn-outline w-full py-3 flex items-center justify-center gap-2 text-red-500">
               Google
            </button>
        </div>
      </div>
    </div>
  );
}