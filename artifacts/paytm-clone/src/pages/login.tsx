import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Login() {
  const [mobile, setMobile] = useState("");

  const handleContinue = () => {
  if (mobile.length !== 10) return;

  console.log("Mobile:", mobile);

  // TODO:
  // Send OTP
  // Navigate to OTP screen
};

const handleGoogle = () => {
  console.log("Google Sign In");

  // TODO:
  // Google authentication
};

  return (
  <div className="relative w-screen h-screen overflow-hidden">

    {/* Background */}
    <img
      src="/long-pg.png"
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/15" />

    {/* Language */}
    <div className="absolute top-8 right-8 z-20">
      <button className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 text-sm text-white">
        English
        <MdKeyboardArrowDown size={18} />
      </button>
    </div>

    {/* Login Content */}
    <div className="relative z-10 flex h-full items-end justify-center">

      <div className="w-full max-w-md px-8 pb-12">

        <h1 className="text-4xl font-bold text-white">
          Welcome back
        </h1>

        <p className="mt-2 text-lg text-white/80">
          Login to your account
        </p>

        <label className="mt-8 mb-3 block text-sm text-white/80">
          Mobile Number
        </label>

        <div className="flex items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Enter mobile number"
            className="flex-1 bg-transparent px-5 py-5 text-white placeholder:text-white/70 outline-none"
          />

          <div className="border-l border-white/20 px-5 text-white font-semibold">
            +91
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={mobile.length !== 10}
          className={`mt-6 w-full rounded-2xl py-5 text-lg font-semibold text-white ${
            mobile.length === 10
              ? "hover:scale-[1.02] active:scale-95"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{
            background: "linear-gradient(90deg,#00B5FF,#007BFF)",
          }}
        >
          Continue
        </button>

        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-white/30"></div>
          <span className="mx-4 text-white/70">OR</span>
          <div className="h-px flex-1 bg-white/30"></div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white py-4 font-semibold text-gray-800 shadow-xl"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-white/80">
          Don't have an account?
          <span className="ml-2 text-cyan-300 font-semibold cursor-pointer">
            Sign Up
          </span>
        </p>

      </div>

    </div>

  </div>
);
