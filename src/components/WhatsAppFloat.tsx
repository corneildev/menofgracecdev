import { Icon } from "@/components/Icon";

export function WhatsAppFloat() {
  const message = encodeURIComponent("Bonjour Men of Grace — j'ai une question.");
  return (
    <a
      href={`https://wa.me/22500000000?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group"
    >
      <span className="hidden sm:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap eyebrow text-background bg-foreground/85 backdrop-blur-sm border border-hairline px-3.5 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center">
        Discuter avec nous
      </span>
      <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform duration-300">
        <Icon name="whatsapp" className="text-2xl sm:text-[26px]" />
      </span>
    </a>
  );
}
