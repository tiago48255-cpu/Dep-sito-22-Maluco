import { useEffect } from 'react';

interface SplashScreenProps {
  onNext: () => void;
}

export default function SplashScreen({ onNext }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[750px] py-16 px-6 text-center bg-black relative overflow-hidden select-none">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,47,191,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Spacer */}
      <div />

      {/* Center Mascot & Brand */}
      <div className="flex flex-col items-center gap-6 relative z-10 animate-fade-in duration-1000">
        <div className="relative w-52 h-52 drop-shadow-[0_0_35px_rgba(61,77,216,0.35)] animate-pulse">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZtxPR4y44-9HmQH-mA4x4h7c2Lws58HCDDapjILzC2HmhuQeLYRambdjY_weveLChuxs_-8BB7weBoxqRQY5D19UWYc41uMVWbPEg5gyDqFXTsU1crsOkTFbtAeY64hXSFgxDb3PUHoUwlcjwcvWa7ZpPNr-W4hFofpfET0JCMs2EpcgRUFu867yw0DUqXdmRGpY5Gak6QE1awXeDphbouxc5aXs5AMpwTDD1XnWUF7YDfb3p7BA6z0lGfSBRmpE188s1CesK30"
            alt="Mascote 22 Maluco"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold font-sans text-white tracking-tight mb-2 uppercase">
            22 Maluco
          </h1>
          <p className="text-on-surface-variant font-medium tracking-widest text-xs uppercase opacity-80">
            Depósito de Bebidas 24h
          </p>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex flex-col items-center gap-3 relative z-10 w-full max-w-[200px]">
        {/* Animated Custom Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-brand-primary-container to-brand-inverse-primary rounded-full animate-[loading_2.5s_ease-in-out_infinite]" style={{ width: '100%' }} />
        </div>
        <p className="text-xs text-neutral-500 font-mono tracking-widest animate-pulse">
          Carregando experiência gelada...
        </p>
      </div>

      {/* Inline styles for custom standard keyframes if needed */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
