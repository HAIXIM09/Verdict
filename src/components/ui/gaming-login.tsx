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
} from 'lucide-react';

// ─── Video Background ────────────────────────────────────────────────
export function VideoBackground({ children, videoUrl }: { children: React.ReactNode; videoUrl?: string }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-stone-950">
      {/* Video element */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
        />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-stone-950/70" />
      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

// ─── Form Input ──────────────────────────────────────────────────────
function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-stone-300"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-lg bg-stone-800/50 border border-stone-700 py-2.5 pl-10 pr-10 text-sm text-white placeholder-stone-400 transition-colors duration-200 focus:border-orange-600/50 focus:outline-none focus:ring-1 focus:ring-orange-600/20"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-300 transition-colors duration-200"
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

// ─── Social Button ───────────────────────────────────────────────────
function SocialButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg bg-stone-800/50 border border-stone-700 px-4 py-2.5 text-sm text-stone-300 transition-colors duration-200 hover:bg-stone-700/50 hover:text-white"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

// ─── Toggle Switch ───────────────────────────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600/30 focus:ring-offset-2 focus:ring-offset-stone-900 ${
          checked ? 'bg-orange-600' : 'bg-stone-700'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span className="text-sm text-stone-400">{label}</span>
    </label>
  );
}

// ─── Login Form ──────────────────────────────────────────────────────
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
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({ email, password, remember });
  };

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-sm bg-stone-900/60 border border-stone-700 rounded-2xl p-8 shadow-xl">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Verdict
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            The internet&apos;s court awaits
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
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <ToggleSwitch
              checked={remember}
              onChange={setRemember}
              label="Remember me"
            />
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-stone-400 hover:text-orange-300 transition-colors duration-200"
              >
                Forgot password?
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:bg-orange-700 hover:shadow-orange-600/30 focus:outline-none focus:ring-2 focus:ring-orange-600/40 focus:ring-offset-2 focus:ring-offset-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Entering...
              </span>
            ) : (
              'Enter Verdict'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stone-700" />
          <span className="text-xs text-stone-500">or continue with</span>
          <div className="h-px flex-1 bg-stone-700" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <SocialButton
            icon={Shield}
            label="Google"
            onClick={() => onSocialLogin?.('google')}
          />
          <SocialButton
            icon={Zap}
            label="Discord"
            onClick={() => onSocialLogin?.('discord')}
          />
          <SocialButton
            icon={Gamepad2}
            label="Steam"
            onClick={() => onSocialLogin?.('steam')}
          />
        </div>

        {/* Create Account */}
        <p className="mt-6 text-center text-sm text-stone-400">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onCreateAccount}
            className="font-medium text-stone-300 hover:text-orange-300 transition-colors duration-200"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Default Export ──────────────────────────────────────────────────
const LoginPage = { LoginForm, VideoBackground };
export default LoginPage;