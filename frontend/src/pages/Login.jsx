import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  Building2,
  ClipboardList,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpRequired, setOtpRequired] = useState(false)
  const [qrCode, setQrCode] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password, otp)

      if (result?.requires_otp || result?.requires_otp_setup) {
        setOtpRequired(true)
        setQrCode(result.qr_code || '')
        setError('')
        return
      }

      setOtpRequired(false)
      setQrCode('')
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.otp?.[0] ||
          'Incorrect email or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#062d2b] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-[#0a3e3a] shadow-[0_30px_80px_rgba(2,25,22,0.45)]">
        <div className="grid min-h-[760px] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden bg-[#f4efe9] p-6 sm:p-8 lg:p-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/dlsjbc/dlsjbc-picture.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1ea]/90 via-[#f5f1ea]/75 to-[#dfeae2]/70" />
            <div className="absolute inset-y-0 right-[-70px] w-36 bg-[#062d2b] rounded-l-[110px] opacity-95" />
            <div className="absolute inset-y-5 right-[-25px] w-20 bg-[#f4efe9] rounded-l-[90px]" />
            <div className="absolute -left-8 top-16 h-40 w-40 rounded-full bg-[#cfe9e1]/60 blur-3xl" />
            <div className="absolute bottom-10 right-12 h-28 w-28 rounded-full bg-[#9ad3c5]/35 blur-3xl" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0b6e4f]/15 bg-white text-[#0b6e4f] shadow-sm">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#0b6e4f]">
                    De La Salle John Bosco College
                  </p>
                  <p className="mt-1 text-xs text-[#4d5b57]">Facilities Office</p>
                </div>
              </div>

              <div className="mt-10 max-w-lg">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#0b6e4f]">
                  Campus access portal
                </p>
                <h1 className="mt-4 font-display text-4xl leading-[1.02] text-[#0c2a27] sm:text-5xl">
                  DLSJBC
                </h1>
                <p className="mt-2 max-w-md text-lg font-semibold uppercase tracking-[0.12em] text-[#0c2a27] sm:text-xl">
                  PHYSICAL PLANT AND EQUIPMENT MANAGEMENT SYSTEM
                </p>
              </div>

              <div className="mt-auto pt-8 text-sm text-[#4d5b57]">
                Managing Campus Facilities and Equipment Efficiently
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-[#062d2b] p-6 sm:p-8 lg:p-10">
            <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-[#17a694]/15 blur-3xl" />
            <div className="absolute bottom-16 right-10 h-32 w-32 rounded-full bg-[#4ec7d4]/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_20px_45px_rgba(3,21,19,0.3)] backdrop-blur-xl sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff6ee] text-[#0b6e4f] ring-1 ring-[#0b6e4f]/10">
                  <LockKeyhole size={20} />
                </div>
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#b0d8d1]">
                    Secure sign in
                  </p>
                  <h2 className="mt-1 text-3xl font-semibold text-white">Welcome Back</h2>
                </div>
              </div>

              <p className="text-sm leading-6 text-[#d9efec]">
                {otpRequired
                  ? 'Scan the QR code in your authenticator app, then enter the 6-digit code below and click Verify OTP.'
                  : 'Sign in to access the Physical Plant and Equipment System'}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-300/40 bg-red-500/10 px-3 py-3 text-sm text-red-100">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d7f7f2]">Username</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@dlsjbc.edu.ph"
                    className="w-full rounded-2xl border border-white/10 bg-[#0f4e46]/70 px-4 py-3 text-sm text-white placeholder:text-[#b8d8d2] transition focus:border-[#70d8d0] focus:bg-[#0f4e46]/85 focus:outline-none focus:ring-4 focus:ring-[#4ec7d4]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d7f7f2]">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-[#0f4e46]/70 px-4 py-3 pr-11 text-sm text-white placeholder:text-[#b8d8d2] transition focus:border-[#70d8d0] focus:bg-[#0f4e46]/85 focus:outline-none focus:ring-4 focus:ring-[#4ec7d4]/20"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#d7f7f2] transition hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {otpRequired && (
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0f4e46]/45 p-4">
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b0d8d1]">
                        Step 1: Scan this QR code
                      </p>
                    </div>

                    {qrCode && (
                      <div className="flex justify-center rounded-2xl bg-white p-3">
                        <img src={qrCode} alt="Authenticator QR code" className="h-32 w-32 object-contain" />
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#d7f7f2]">
                        Step 2: Enter the 6-digit authenticator code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        className="w-full rounded-2xl border border-white/10 bg-[#0f4e46]/70 px-4 py-3 text-sm text-white placeholder:text-[#b8d8d2] transition focus:border-[#70d8d0] focus:bg-[#0f4e46]/85 focus:outline-none focus:ring-4 focus:ring-[#4ec7d4]/20"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#20c4c9] px-4 py-3.5 text-sm font-semibold text-[#062d2b] transition duration-150 hover:bg-[#39d2d8] hover:shadow-[0_12px_24px_rgba(32,196,201,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in…' : otpRequired ? 'Verify OTP' : 'Login'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
