import React from "react";

export default function
  CreateAccount() {
    return (
      <div style={ { maxWidth: "400px" , margin: "40px auto" } }>
        <h2>Create Account</h2>
        <form>
           <input type="text" placeholder="First Name" /><br /><br />
            <input type="text" placeholder="Last Name" /><br /><br />
            <br /><br />
          <div style={{ marginBottom: "15px"}}>
            <label>date of Birth</label>
            <br /><input type="date" name="dateOfBirth" required style={{ width: "100%", padding: "10px", marginTop: "5px"
                                                                        }}
                    />
          </div>
        <input type="email" placeholder="Email ID" /><br /><br />
        <div>
        <span>+91 </span>span>
        <input type="tel" placeholder="Mobile Number" maxLength={10} /></div>div><br />
        <input type="password" placeholder="Password" /><br /><br />
        <input type="password" placeholder="Confirm Password" /><br /><br />
        <button type="Submit">
           Create Account
        </button>
        </form>
      </div>
      );
  }
