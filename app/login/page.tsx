"use client";
import Link from "next/link";
import Image from "next/image"; 
import { Loader2 } from "lucide-react"; 
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
          <button className="btn-primary py-2 px-6 text-sm border-b-4 shadow-lg shadow-sky-100">
            Sign Up
          </button>
        </Link>
      </div>

      <div className="w-full flex justify-center mt-12 mb-8 relative z-10">
         <Link href="/" className="text-4xl font-extrabold tracking-tighter flex items-center gap-3 group">
            <Image 
              src="/icon.png" 
              alt="Castpotro Logo" 
              width={70} 
              height={70} 
              className="object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-pink-500">
              castpotro
            </span>
         </Link>
      </div>

      {/* Login Card: Increased frosting (bg-white/70) */}
      <div className="w-full max-w-[375px] flex flex-col gap-6 text-center relative z-10 bg-white/70 backdrop-blur-xl p-8 rounded-[32px] border-2 border-white/50 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-800">Log in</h2>
        
        <form className="flex flex-col gap-4" action={formAction}>
          <input type="email" name="email" placeholder="Email" className="input-field" required />
          <div className="relative">
             <input type="password" name="password" placeholder="Password" className="input-field" required />
             <div className="absolute right-4 top-4 text-slate-400 text-sm font-bold tracking-wider cursor-pointer hover:text-[#0ea5e9] transition-colors uppercase">
                Forgot?
             </div>
          </div>
          
          {state?.message && !state.success && (
             <p className="text-pink-500 text-sm font-bold animate-pulse">{state.message}</p>
          )}

          <button disabled={isPending || state?.success} className="btn-primary w-full py-3 text-lg mt-2 shadow-xl shadow-sky-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending || state?.success ? <Loader2 className="animate-spin" /> : null}
            {isPending ? 'Logging in...' : state?.success ? 'Redirecting...' : 'Log in'}
          </button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <div className="h-[2px] bg-slate-200/50 flex-1"></div>
          <span className="text-slate-400 font-bold text-sm uppercase">or</span>
          <div className="h-[2px] bg-slate-200/50 flex-1"></div>
        </div>

        <div className="flex gap-4 justify-center">
            <button type="button" className="btn-outline w-full py-3 flex items-center justify-center gap-2 text-[#3b5998] hover:bg-white/60">
               Facebook
            </button>
             <button type="button" className="btn-outline w-full py-3 flex items-center justify-center gap-2 text-red-500 hover:bg-white/60">
               Google
            </button>
        </div>
      </div>
    </div>
  );
}