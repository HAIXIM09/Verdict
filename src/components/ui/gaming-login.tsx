'use client';

import React, { useState, type FormEvent } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Shield,
  Zap,
  Gamepad2,
  Flame,
} from 'lucide-react';

// ─── Video Background with mesh overlay ──────────────────
export function VideoBackground({ children, videoUrl }: { children: React.ReactNode; videoUrl?: string }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
      {/* Video element */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src={videoUrl}
        />
      )}
      {/* Animated mesh gradient overlay — replaces flat dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d080d] via-[#050505] to-[#09090B]" />
      <div className="absolute inset-0 gradient-mesh opacity-80" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Animated accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-[120px] orb-1" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-[100px] orb-2" />



      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

// ─── Form Input with animated focus ring ─────────────────
function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  delay = 0,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
  required?: boolean;
  delay?: number;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div
      className="space-y-1.5"
      style={{
        opacity: 0,
        transform: 'translateY(12px)',
        animation: `slide-up-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + delay * 0.1}s both`,
      }}
    >
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-zinc-400"
      >
        {label}
      </label>
      <div className="relative group">
        <Icon className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
          focused ? 'text-pink-500' : 'text-zinc-500'
        }`} />
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl bg-white/[0.03] border transition-all duration-300 py-3 pl-11 pr-11 text-sm text-white placeholder-zinc-600 focus:bg-white/[0.05] focus:outline-none focus:ring-0"
          style={{
            borderColor: focused ? 'rgba(236, 72, 153, 0.4)' : 'rgba(63, 63, 70, 0.3)',
            boxShadow: focused ? '0 0 0 3px rgba(236, 72, 153, 0.08), 0 0 20px rgba(236, 72, 153, 0.05)' : 'none',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Social Button ────────────────────────────────────────
function SocialButton({
  icon: Icon,
  label,
  onClick,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-zinc-800/60 px-4 py-2.5 text-sm text-zinc-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:border-zinc-700 hover:shadow-[0_0_20px_rgba(236,72,153,0.06)]"
      style={{
        opacity: 0,
        transform: 'translateY(12px)',
        animation: `slide-up-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.8 + delay * 0.08}s both`,
      }}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

// ─── Login Form ───────────────────────────────────────────
interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => void;
  onSocialLogin?: (provider: string) => void;
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}

export function LoginForm({
  onSubmit,
  onSocialLogin,
  onCreateAccount,
  onForgotPassword,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({ email, password, remember: true });
  };

  return (
    <div className="w-full max-w-md">
      {/* Glass card with animated border glow */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[1px] gradient-border" style={{ zIndex: 0 }}>
          <div className="w-full h-full rounded-2xl bg-[#0c0c0e]" />
        </div>

        {/* Card content */}
        <div className="relative z-10 backdrop-blur-xl bg-[#0c0c0e]/80 rounded-2xl p-8 sm:p-10">
          {/* Logo / Brand */}
          <div className="text-center mb-10" style={{
            opacity: 0,
            transform: 'translateY(16px) scale(0.95)',
            animation: 'slide-up-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
          }}>
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-pink-600 to-violet-600 mb-5 shadow-[0_8px_32px_rgba(236,72,153,0.3)]">
              <Flame className="size-7 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white font-heading">
              VERDICT<span className="text-pink-500">.</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-500 tracking-wide">
              Where opinions get settled
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              delay={0}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              delay={1}
            />

            {/* Submit */}
            <div style={{
              opacity: 0,
              transform: 'translateY(12px)',
              animation: 'slide-up-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both',
            }}>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full rounded-xl btn-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Entering the Arena...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Flame className="size-4" />
                    Enter the Arena
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3" style={{
            opacity: 0,
            animation: 'slide-up-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both',
          }}>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            <span className="text-[11px] text-zinc-600 uppercase tracking-widest">or continue with</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <SocialButton icon={Shield} label="Google" onClick={() => onSocialLogin?.('google')} delay={0} />
            <SocialButton icon={Zap} label="Discord" onClick={() => onSocialLogin?.('discord')} delay={1} />
            <SocialButton icon={Gamepad2} label="Steam" onClick={() => onSocialLogin?.('steam')} delay={2} />
          </div>

          {/* Create Account */}
          <p className="mt-7 text-center text-sm text-zinc-500" style={{
            opacity: 0,
            animation: 'slide-up-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1s both',
          }}>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onCreateAccount}
              className="font-medium text-zinc-300 hover:text-pink-400 transition-colors duration-200"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Default Export ───────────────────────────────────────
const LoginPage = { LoginForm, VideoBackground };
export default LoginPage;