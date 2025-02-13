import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const API_URL = "http://localhost:8080/api/auth";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password");
      return;
    }

    console.log("🔹 Sending Login Request:", { email, password });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔹 Response Data:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("🔥 Error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="p-6 font-sans bg-gradient-to-b from-[#24002a] via-[#000000] to-[#000000] min-h-screen text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#1b1b1b] via-[#161616] to-[#0d0d0d] p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Login</h2>
        {message && <p className="text-red-400 mb-4 text-center">{message}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded mb-4 bg-[#2a2a2a] text-white placeholder-gray-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded mb-4 bg-[#2a2a2a] text-white placeholder-gray-400"
          required
        />
        <button type="submit" className="w-full bg-[#6a0dad] text-white p-2 rounded hover:bg-[#4e0e8b] transition">
          Login
        </button>
        <p className="text-center text-sm mt-4 text-gray-300">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="text-purple-400 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
