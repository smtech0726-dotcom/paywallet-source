import { useState } from "react";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleContinue = async () => {
    if (mobile.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/auth/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: mobile,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP request failed");
      }

      console.log("OTP:", data.otp);

      setOtp(data.otp);

      alert(`OTP generated: ${data.otp}`);

    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-purple-500 to-indigo-700 flex items-center p-6">

      <div className="w-full max-w-md rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl p-8">

        <div className="text-center mb-8">

          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg">
            <span className="text-3xl">💳</span>
          </div>

          <h1 className="text-4xl font-bold text-white mt-5">
            SMTECH
          </h1>

          <p className="text-white/80 mt-2">
            India's Smart Payments App
          </p>

        </div>


        <label className="text-white text-sm">
          Mobile number
        </label>


        <input
          type="tel"
          maxLength={10}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
          className="w-full mt-2 rounded-xl bg-white/30 backdrop-blur-md p-4 text-white placeholder-white/70"
        />


        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full mt-6 rounded-xl bg-white text-indigo-700 font-bold py-4 hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Continue"}
        </button>


        {otp && (
          <div className="mt-5 text-center text-white">
            Demo OTP: <b>{otp}</b>
          </div>
        )}


        <div className="text-center mt-6 text-white/80 text-sm">
          100% Secure Payments
        </div>


        <div className="mt-8 text-center text-white/70 text-sm">
          By continuing you agree to our
          <br />
          Terms & Privacy Policy
        </div>

      </div>

    </div>
  );
}
