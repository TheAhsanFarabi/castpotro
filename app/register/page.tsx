"use client";
import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { registerAction } from '../actions';
import confetti from 'canvas-confetti'; // Import the library

const initialState = {
  message: '',
  success: false, // Track success status
};

function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const router = useRouter();

  // Watch for success state
  useEffect(() => {
    if (state?.success) {
      // 1. Trigger Confetti - "School Pride" Effect (Cannons from sides)
      const end = Date.now() + 3 * 1000; // Run for 3 seconds
      const colors = ['#0ea5e9', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // 2. Redirect after a short delay so user sees the effect
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-white">
      <div className="w-full max-w-[375px] mt-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Create your profile</h2>
        <p className="text-slate-500 mb-8 font-medium">
          Save your progress and keep learning!
        </p>
        
        <form className="flex flex-col gap-3" action={formAction}>
          <input type="text" name="age" placeholder="Age" className="input-field" required />
          <input type="text" name="name" placeholder="Name (optional)" className="input-field" />
          <input type="email" name="email" placeholder="Email" className="input-field" required />
          <input type="password" name="password" placeholder="Password" className="input-field" required />
          
          {/* Success/Error Message Display */}
          {state?.message && (
             <p className={`text-sm font-bold ${state.success ? 'text-green-500' : 'text-red-500'}`}>
               {state.message}
             </p>
          )}

          <button 
            disabled={isPending || state?.success} 
            className="btn-primary w-full py-3 mt-4 text-lg shadow-lg shadow-sky-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {isPending ? 'Creating...' : state?.success ? 'Success!' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
           <p className="text-slate-400 text-sm">
             Already have an account? <Link href="/login" className="text-[#0ea5e9] font-bold">Log in</Link>
           </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}