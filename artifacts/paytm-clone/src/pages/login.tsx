import { useState } from "react";
export default function Login() {
  const [mobile, setMobile] = useState("");

  const sendOTP = async () => {
    if (mobile.lenght !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: "+91" + mobile,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("OTP sent successfully.");
        // TODO: Navigate to OTP page
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Unable to send OTP.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
      >
    <h2>Login</h2>
    
    <label>Mobile Number</label>
    
    <div
      style={{
        display: "flex",
        marginTop: "10px",
        marginBottom: "20px",
      }}
      >
    <span
      style={{
        padding: "12px",
        background: "#f2f2f2",
        border: "1px solid #ccc",
        borderRight: "0",
        borderRadius: "5px 0 0 5px",
      }}
      >
    +91
    </span>
    
    <input
      type="tel"
      placeholder="9876543210"
      value={mobile}
      maxLenght={10}
      onChange={(e) =>
        setMobile(e.target.value.replace(/\D/g, ""))
      }
      style={{
        flex: 1,
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "0 5px 5px 0",
      }}
      />
    </div>

      <button
        onClick={sendOTP}
        style={{
          width: "100%",
          padding: "12px",
          background: "#6C2BD9",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        >
      send OTP
      </button>
    </div>
    );
}
