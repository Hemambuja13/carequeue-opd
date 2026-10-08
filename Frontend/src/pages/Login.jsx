import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/common/AuthLayout.jsx";

const roleRedirect = {
  patient: "/patient/dashboard",
  nurse: "/nurse/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(roleRedirect[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-textDark">
          Welcome back
        </h1>
        <p className="text-textMuted mt-2">
          Sign in to view your appointments and queue status
        </p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-severity-high bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-textDark mb-2">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-textDark placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-textDark">
              Password
            </label>
            <button type="button" className="text-sm text-primary hover:underline">
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-textDark placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary-dark active:scale-[0.99] transition disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-textMuted">
          New patient?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <p className="mt-6 text-xs text-textMuted text-center">
        Hospital staff (nurse / doctor / admin) use the credentials issued to you.
      </p>
    </AuthLayout>
  );
};

export default Login;