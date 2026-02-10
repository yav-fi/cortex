export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-semibold text-sm text-white/80">
              Cortex
            </span>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Terms
              </a>
              <a
                href="mailto:hello@apprenticebio.ai"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} Cortex Bio. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
