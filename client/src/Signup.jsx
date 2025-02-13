import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const API_URL = "http://localhost:8080/api/auth";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500); // Redirect after 1.5s
      } else {
        setMessage(data.msg || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="p-6 font-sans bg-gradient-to-b from-[#24002a] via-[#000000] to-[#000000] min-h-screen text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#1b1b1b] via-[#161616] to-[#0d0d0d] p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Sign Up</h2>
        {message && <p className="text-red-400 mb-4 text-center">{message}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded mb-4 bg-[#2a2a2a] text-white placeholder-gray-400"
          required
        />
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
          Sign Up
        </button>
        <p className="text-center text-sm mt-4 text-gray-300">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-purple-400 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
