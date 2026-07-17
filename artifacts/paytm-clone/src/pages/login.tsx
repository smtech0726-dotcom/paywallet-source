import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Login() {
  const [mobile, setMobile] = useState("");

  const handleContinue = () => {
    console.log("Mobile:", mobile);
  };

  const handleGoogle = () => {
    console.log("Google Sign In");
  };

  return (
   <div
  className="min-h-screen bg-cover bg-top bg-no-repeat flex justify-center items-center relative"
  style={{
    backgroundImage: "url('/long-pg.png')",
  }}
>      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Language */}
      <div className="absolute top-8 right-8 z-10">
        <button className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 text-sm text-white">
          English
          <MdKeyboardArrowDown size={18} />
        </button>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-8 flex flex-col justify-end min-h-screen pb-14">
        <div className="mt-40">
          <h1 className="text-4xl font-bold text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-white/80 text-lg">
            Login to your account
          </p>

          {/* Mobile Input */}
          <div className="mt-10 flex items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden shadow-xl focus-within:border-cyan-400">
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              className="flex-1 bg-transparent px-5 py-5 text-white placeholder:text-white/70 outline-none"
            />

            <div className="px-5 text-white font-semibold border-l border-white/20">
              +91
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="mt-6 w-full rounded-2xl py-5 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95"
            style={{
              background:
                "linear-gradient(90deg,#00B5FF,#007BFF)",
            }}
          >
            Continue
          </button>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-white/30" />
            <span className="mx-4 text-white/70 text-sm">
              OR
            </span>
            <div className="flex-1 h-px bg-white/30" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white py-4 font-semibold text-gray-800 shadow-2xl transition hover:scale-[1.01]"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>

          {/* Sign Up */}
          <p className="mt-10 text-center text-white/80">
            Don't have an account?
            <span className="ml-2 cursor-pointer font-semibold text-cyan-300 hover:text-cyan-200">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
