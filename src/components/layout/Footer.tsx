import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WHATSAPP_URL } from "@/lib/constants";

/** Footer do desktop — design Nocturnal Pulse (Stitch). Oculto no mobile. */
export function Footer() {
  return (
    <footer className="hidden md:block w-full mt-xl bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-xl max-w-[1440px] mx-auto">
        <div>
          <span className="text-headline-md text-primary mb-4 block">22 Maluco</span>
          <p className="text-body-sm text-on-surface-variant mb-6">
            A sua conveniência preferida na palma da mão. Entregamos a gelada onde você estiver, 24h por dia.
          </p>
          <div className="flex gap-4">
            <a href="{WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="chat" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="photo_camera" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-label-lg text-on-surface mb-6">Navegação</h4>
          <ul className="space-y-4">
            <li><Link href="/" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Início</Link></li>
            <li><Link href="/categorias" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Categorias</Link></li>
            <li><Link href="/pedidos" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Meus Pedidos</Link></li>
            <li><Link href="/perfil" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Perfil</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-label-lg text-on-surface mb-6">Suporte</h4>
          <ul className="space-y-4">
            <li><a href="{WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Falar no WhatsApp</a></li>
            <li><span className="text-body-sm text-on-surface-variant">Entrega 24 horas</span></li>
            <li><span className="text-body-sm text-on-surface-variant">Caioaba, Nova Iguaçu</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-label-lg text-on-surface mb-6">Formas de pagamento</h4>
          <div className="flex gap-3 text-on-surface-variant">
            <Icon name="pix" className="text-2xl" />
            <Icon name="credit_card" className="text-2xl" />
            <Icon name="payments" className="text-2xl" />
            <Icon name="contactless" className="text-2xl" />
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/10 py-8 px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-body-sm text-on-surface-variant">
            © 2026 22 Maluco — Depósito de Bebidas. Beba com moderação.
          </span>
          <span className="text-label-md text-on-surface-variant uppercase tracking-widest opacity-60">
            Venda proibida para menores de 18 anos
          </span>
        </div>
      </div>