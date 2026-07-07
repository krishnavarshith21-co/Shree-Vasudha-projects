import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] bg-[#b59b54]/10 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-[-30%] right-[-15%] w-[60%] h-[60%] bg-[#b59b54]/8 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        {/* Gold accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#b59b54]/40 to-transparent" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        {/* Logo Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#b59b54] to-[#8a7440] mb-6 shadow-[0_0_40px_rgba(181,155,84,0.3)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1
            className="text-3xl font-light text-white tracking-wide mb-2"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Shree Vasudha
          </h1>
          <p className="text-[#666] text-sm tracking-[0.2em] uppercase">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414]/90 backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h2 className="text-xl text-white font-medium mb-1">Welcome back</h2>
            <p className="text-[#666] text-sm">
              Sign in to manage your website
            </p>
          </div>

          <form action={login} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@shreevasudha.com"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 focus:ring-1 focus:ring-[#b59b54]/30 transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="block text-xs font-medium text-white/50 tracking-wider uppercase"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[#b59b54]/70 hover:text-[#b59b54] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#b59b54]/50 focus:ring-1 focus:ring-[#b59b54]/30 transition-all duration-300"
              />
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#b59b54] focus:ring-[#b59b54]/30"
              />
              <label htmlFor="remember" className="text-sm text-white/40">
                Remember me
              </label>
            </div>

            {/* Error */}
            {params?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-sm text-center">
                {params.error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#b59b54] to-[#9a8347] hover:from-[#c9ae6a] hover:to-[#b59b54] text-black font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(181,155,84,0.25)] hover:shadow-[0_0_40px_rgba(181,155,84,0.4)] text-sm tracking-wide"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-white/20">
          &copy; {new Date().getFullYear()} Shree Vasudha Projects &middot; Secure Admin Access
        </div>
      </div>
    </div>
  );
}
