import React, { useState } from "react";
import { login } from "../../firebase/auth";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link as well

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // ✅ hook to redirect

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setMsg("Login successful 🎉");
      navigate("/chat");  // ✅ redirect to AI chatbot page
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {msg && <p>{msg}</p>}
        
        {/* Navigation link to signup */}
        <div className="auth-navigation">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
