import React, { useState } from 'react';
import { MessageSquare, ShieldAlert, Sparkles, Clock, Truck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (phone: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Simple mask for Brazilian phone phone standard: (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Keep only numbers
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 7) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setPhone(value);
    if (value.length > 0) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumbers = phone.replace(/\D/g, '');
    
    if (cleanNumbers.length < 10) {
      setErrorMessage('Por favor, informe seu telefone com DDD.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 800);
      return;
    }

    onLogin(phone);
  };

  const handleSocialLogin = () => {
    onLogin('(21) 99999-9999'); // Preloads mock phone for visual success
  };

  return (
    <div className="flex flex-col min-h-[750px] px-6 pt-10 pb-8 bg-black relative justify-between overflow-y-auto">
      {/* Brand logo header */}
      <header className="flex flex-col items-center mt-4 mb-4 select-none">
        <div className="relative w-36 h-36 mb-2 drop-shadow-[0_0_20px_rgba(61,77,216,0.3)]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZtxPR4y44-9HmQH-mA4x4h7c2Lws58HCDDapjILzC2HmhuQeLYRambdjY_weveLChuxs_-8BB7weBoxqRQY5D19UWYc41uMVWbPEg5gyDqFXTsU1crsOkTFbtAeY64hXSFgxDb3PUHoUwlcjwcvWa7ZpPNr-W4hFofpfET0JCMs2EpcgRUFu867yw0DUqXdmRGpY5Gak6QE1awXeDphbouxc5aXs5AMpwTDD1XnWUF7YDfb3p7BA6z0lGfSBRmpE188s1CesK30"
            alt="Mascote 22 Maluco"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-2xl font-black font-sans text-white tracking-tight leading-tight uppercase">
          22 MALUCO
        </h1>
        <p className="text-on-surface-variant text-xs opacity-70">
          Depósito de Bebidas 24h
        </p>
      </header>

      {/* Main Glass Login Card */}
      <section 
        className={`glass-panel p-6 rounded-[32px] flex flex-col gap-5 shadow-royal-glow transition-transform duration-300 ${
          isShaking ? 'animate-bounce border-rose-500/50' : 'border-white/5'
        }`}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-tight mb-1">
            Bem-vindo!
          </h2>
          <p className="text-xs text-on-surface-variant opacity-85">
            Entre para continuar seu pedido
          </p>
        </div>

        {/* Input & Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 align-left">
            <label className="text-xs text-on-surface-variant font-bold px-1 text-left" htmlFor="phone-input">
              Telefone
            </label>
            <input
              id="phone-input"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(21) 99999-9999"
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 px-4 text-white text-base input-focus-ring placeholder:text-neutral-700 font-medium"
            />
            {errorMessage && (
              <span className="text-[11px] text-rose-400 font-semibold px-1 flex items-center gap-1 mt-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {errorMessage}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-gradient w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-royal-glow flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150"
          >
            <MessageSquare className="w-4.5 h-4.5 fill-current" />
            <span>Entrar com WhatsApp</span>
          </button>
        </form>

        {/* Simple visual separator divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-40">ou</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        {/* Social login option */}
        <button
          onClick={handleSocialLogin}
          className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150 border border-white/5 shadow-md"
        >
          <img
            alt="Google logo"
            className="w-4.5 h-4.5"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRQoM71C7vjih4tCBljnPESRUvjSdMPBoPWCB_H_XUJhCgAW3GTCPrXGRabGaj4VHJ8ogPT8f2RvEVVRU9vIZmmi82HZTt52bSOAPQ0Ud2KOCmeDmXO5OhcaaC3h3BsYkcwKS3-kwv2vGTHHDdWS_16pCrJA1Df0i4M55zveG7zrCI_vkOWAbXbHt3MJ9T8QWuh4q4UBdHuYZ9cmIogGmlEedRGT4GTkVrsiD0zklnDG8n1bas03CMXDMWV5Gw68vC7DPI3PU7dJA"
            referrerPolicy="no-referrer"
          />
          <span>Entrar com Google</span>
        </button>

        {/* Create account simulation */}
        <div className="text-center pt-1 border-t border-white/5">
          <p className="text-xs text-on-surface-variant">
            Ainda não tem conta?{' '}
            <button 
              type="button" 
              onClick={handleSocialLogin}
              className="text-brand-primary font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline"
            >
              Criar conta
            </button>
          </p>
        </div>
      </section>

      {/* Value Prop cards */}
      <section className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-white/5">
          <div className="w-9 h-9 rounded-full bg-brand-primary-container/30 flex items-center justify-center text-brand-primary">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white uppercase tracking-wider">24 HORAS</p>
            <p className="text-[10px] text-on-surface-variant leading-none">Sempre disponível</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-white/5">
          <div className="w-9 h-9 rounded-full bg-brand-secondary-container/30 flex items-center justify-center text-brand-secondary">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white uppercase tracking-wider">RÁPIDA</p>
            <p className="text-[10px] text-on-surface-variant leading-none">Chega em minutos</p>
          </div>
        </div>
      </section>

      {/* Subtle legal footer */}
      <footer className="mt-6 text-center select-none">
        <p className="text-[9px] text-neutral-600 uppercase tracking-widest font-mono">
          Se beber, não dirija. Venda proibida para menores de 18 anos.
        </p>
      </footer>
    </div>
  );
}
