import { ArrowLeft, Leaf } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#f9f8f4] p-6">
      <div className="w-full max-w-md p-8 bg-white border border-[#e6e2da] rounded-3xl text-center shadow-lg space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#f4e2d9] flex items-center justify-center text-[#c27b66]">
          <Leaf size={32} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#a65d4a]">Page not found</p>
          <h1 className="text-3xl font-serif font-semibold text-[#2d3a31] mt-2">Let’s find our way back</h1>
          <p className="text-sm text-[#798177] mt-3">
            The path you followed doesn't seem to exist or may have moved.
          </p>
        </div>

        <button
          onClick={() => setLocation("/")}
          className="forest-button w-full"
        >
          <ArrowLeft size={16} /> Return to MANAS
        </button>
      </div>
    </main>
  );
}
