import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./api";

const Login = () => {
  const API_URL = `${API_BASE}/auth`;
  const API_URL = "http://localhost:8000/api/auth";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password");
      return;
    }

    setMsg("");
    if (!email.trim() || !password.trim()) { setMsg("Please fill in all fields"); setMsgType("error"); return; }
    if (!email.includes("@")) { setMsg("Enter a valid email address"); setMsgType("error"); return; }
    if (password.length < 6) { setMsg("Password must be at least 6 characters"); setMsgType("error"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMsg("Welcome back! Redirecting..."); setMsgType("success");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setMsg(data.msg || "Login failed."); setMsgType("error");
      }
    } catch (error) {
      console.error("🔥 Error:", error);
      setMessage("Can't reach the server. Is the backend running?");
    } catch {
      setMsg("Connection error. Please try again."); setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "radial-gradient(ellipse at top, #050d1f 0%, #020617 70%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2">
            <span className="text-4xl">🌍</span>
            <span className="text-2xl font-bold gradient-text">Next Stop</span>
          </button>
          <p className="text-blue-400/60 mt-2 text-sm">Welcome back, traveler</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Sign In</h1>
            <p className="text-blue-300/50 text-sm mt-0.5">Continue your journey</p>
          </div>

          {msg && (
            <div className={`p-3.5 rounded-xl text-sm flex items-center gap-2 ${
              msgType === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}>
              <span>{msgType === "success" ? "✓" : "✕"}</span> {msg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-blue-200/80">Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-blue-200/80">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-14"
                required
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-300 text-xs font-medium">
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base rounded-xl">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : "Sign In →"}
          </button>

          <p className="text-center text-blue-400/60 text-sm">
            No account?{" "}
            <button type="button" onClick={() => navigate("/signup")} className="text-blue-400 hover:text-cyan-400 font-semibold transition-colors">
              Create one free
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
