import { useState } from "react";

export default function Login() {
  const [mobile, setMobile] = useState("");

  const handleContinue = () => {
    console.log(mobile);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
      }}
    >
      <div className="w-full max-w-md px-8">
        <div className="text-white mb-12">
          <h1 className="text-5xl font-bold">AquaPay</h1>
          <p className="text-xl opacity-80">
            Simple. Secure. Seamless.
          </p>
        </div>

        <div className="mt-72">
          <h2 className="text-4xl font-bold text-white">
            Welcome back
          </h2>

          <p className="text-white/80 mb-8">
            Login to your account
          </p>

          <div className="flex rounded-2xl overflow-hidden border border-white/30 backdrop-blur-lg">
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              className="flex-1 bg-transparent text-white px-5 py-5 outline-none placeholder:text-white/60"
            />

            <div className="px-5 flex items-center text-white">
              +91
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full mt-6 py-5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl"
          >
            Continue
          </button>

          <div className="text-center text-white mt-10">
            or continue with
          </div>

          <div className="flex justify-center gap-8 mt-6">
            <button className="w-16 h-16 rounded-full bg-white/20 text-white">
              G
            </button>

            <button className="w-16 h-16 rounded-full bg-white/20 text-white">
              
            </button>

            <button className="w-16 h-16 rounded-full bg-white/20 text-white">
              ☎
            </button>
          </div>

          <div className="text-center mt-10 text-white">
            New to AquaPay?
            <span className="text-sky-400 font-semibold cursor-pointer ml-2">
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
