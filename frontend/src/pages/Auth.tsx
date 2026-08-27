import { ArrowLeft, ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { api } from "../lib/api";

/** MANAS-AI — Botanical / Organic Serif accessible email and password authentication interface. */

export default function Auth({ mode }: { mode: "login" | "signup" }) {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const creating = mode === "signup";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating && name.trim().length < 2) {
      toast.error("Please enter the name you’d like MANAS to use.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      if (creating) {
        await api.signup({
          email: email.trim(),
          password,
          name: name.trim(),
        });
        toast.success("Your private space is ready!");
      } else {
        await api.login({ email: email.trim(), password });
        toast.success("Welcome back to your space.");
      }
      setLocation("/app");
    } catch (err: any) {
      const msg = err.message || (creating ? "Signup failed" : "Invalid email or password");
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <button className="auth-brand" onClick={() => setLocation("/")}>
          <img src="/manus-storage/manas-botanical-mark_9a86e026.png" alt="MANAS" />
          <b>MANAS</b>
        </button>
        <div className="auth-visual-copy">
          <p className="soft-label"><span />A PRIVATE PLACE TO ARRIVE</p>
          <h1>Let your thoughts<br /><em>unfold slowly.</em></h1>
          <p>MANAS is built for reflection, not performance. You’re always in control of what stays.</p>
        </div>
        <div className="auth-image-arch">
          <img src="/manus-storage/manas-botanical-hero_6d953861.png" alt="Warm botanical nook with a journal" />
        </div>
        <div className="auth-protection">
          <LockKeyhole size={16} strokeWidth={1.5} />
          <span><b>Private by design</b>Your conversations belong to you.</span>
        </div>
      </section>

      <section className="auth-form-wrap">
        <button className="back-home" onClick={() => setLocation("/")}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Back to MANAS
        </button>
        <motion.div
          className="auth-form-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="auth-heading">
            <p className="soft-label"><span />{creating ? "YOUR NEW PRIVATE SPACE" : "WELCOME BACK"}</p>
            <h2>
              {creating ? (
                <>A space that<br /><em>holds your context.</em></>
              ) : (
                <>Return to<br /><em>your space.</em></>
              )}
            </h2>
            <p>
              {creating
                ? "Create your account to begin a calmer, more continuous conversation."
                : "Log in to continue the conversation at your own pace."}
            </p>
          </div>

          <form onSubmit={submit} noValidate>
            {creating && (
              <div className="field">
                <label htmlFor="name">First name</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="given-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="What should MANAS call you?"
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <div className="field-label-row">
                <label htmlFor="password">Password</label>
                {!creating && (
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => toast.info("Contact your administrator or create a new account to reset.")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={creating ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={creating ? "At least 6 characters" : "Enter your password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {creating ? (
              <p className="password-note">
                <ShieldCheck size={16} strokeWidth={1.5} />
                Your private space begins with you. You can edit or remove memories whenever you wish.
              </p>
            ) : (
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <span>Keep me signed in on this device</span>
              </label>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="forest-button auth-submit"
            >
              {isLoading
                ? "Connecting..."
                : creating
                ? "Create my private space"
                : "Log in to MANAS"}{" "}
              <ArrowRight size={17} strokeWidth={1.5} />
            </button>
          </form>

          <p className="auth-switch">
            {creating ? "Already have a space?" : "New to MANAS?"}{" "}
            <button onClick={() => setLocation(creating ? "/login" : "/signup")}>
              {creating ? "Log in" : "Create an account"}
            </button>
          </p>
        </motion.div>
        <p className="auth-bottom">
          <Leaf size={15} strokeWidth={1.5} />
          MANAS is a reflective companion, not a crisis or emergency service.
        </p>
      </section>
    </main>
  );
}
