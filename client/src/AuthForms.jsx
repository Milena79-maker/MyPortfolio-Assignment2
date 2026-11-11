
import { useState } from "react";

const API = "http://localhost:5000";

export default function AuthForms({ onSessionChange }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        mode === "signin"
          ? "/api/users/signin"
          : "/api/users";

      const body =
        mode === "signin"
          ? {
              email: form.email,
              password: form.password
            }
          : form;

      const response = await fetch(API + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Request failed"
        );
      }

      if (mode === "signin") {
        const newSession = {
          token: data.token,
          user: data.user
        };

        setSession(newSession);
        onSessionChange?.(newSession);
        setMessage("Successfully signed in!");
      } else {
        setMessage("Account created! Please sign in.");
        setMode("signin");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    setSession(null);
    onSessionChange?.(null);
    setMessage("Signed out successfully.");
  }

  if (session) {
    return (
      <section id="account">
        <h2>My Account</h2>

        <p>
          Welcome, {session.user?.name || "User"}!
        </p>

        <p>You are signed in.</p>

        <p>
          Account role: {session.user?.role || "user"}
        </p>

        <button type="button" onClick={signOut}>
          Sign Out
        </button>

        <p role="status">{message}</p>
      </section>
    );
  }

  return (
    <section id="account">
      <h2>
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div>
            <label htmlFor="auth-name">Name</label>
            <input
              id="auth-name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          </div>
        )}

        <div>
          <label htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />
        </div>

        <div>
          <label htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "signin"
            ? "Sign In"
            : "Sign Up"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(
            mode === "signin" ? "signup" : "signin"
          );
          setMessage("");
        }}
      >
        {mode === "signin"
          ? "Create an Account"
          : "Already have an account? Sign In"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
}