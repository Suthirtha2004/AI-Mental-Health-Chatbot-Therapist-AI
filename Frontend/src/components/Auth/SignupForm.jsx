import React, { useState } from "react";
import { signup } from "../../firebase/auth";
import "./auth.css";
import { Link } from "react-router-dom";  

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      setMsg(
        <span>
          Signup successful 🎉 You can now{" "}
          <Link to="/login" style={{ color: "#6a5acd", fontWeight: "bold" }}>
            Login
          </Link>
          .
        </span>
      );
      //setMsg("Signup successful 🎉 You can now log in.");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

export default SignupForm;
