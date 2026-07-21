import { useState } from "react";
import { useLocation } from "wouter";
import { useVerifyOtp } from "@workspace/api-client-react";

export default function OTP() {

  const [, setLocation] = useLocation();

  const [otp,setOtp] = useState("");
  
  // get mobile from localStorage
  const mobile = localStorage.getItem("mobile") || "";


  const verifyOtp = useVerifyOtp({
    mutation:{
      onSuccess:()=>{
        alert("Login Successful");
        setLocation("/");
      },
      onError:(error)=>{
        alert("Invalid OTP");
        console.log(error);
      }
    }
  });


  const submitOTP = ()=>{

    if(otp.length !== 6){
      alert("Enter 6 digit OTP");
      return;
    }


    verifyOtp.mutate({
      data:{
        phone:"+91"+mobile,
        otp:otp
      }
    });

  };


  return (
    <div className="p-5">

      <h2 className="text-xl font-bold">
        Enter OTP
      </h2>


      <input
        className="border p-3 mt-5 w-full"
        value={otp}
        maxLength={6}
        placeholder="123456"
        onChange={(e)=>setOtp(e.target.value)}
      />


      <button
        className="bg-purple-600 text-white p-3 mt-5 w-full rounded"
        onClick={submitOTP}
      >
        Verify OTP
      </button>

    </div>
  );
}
