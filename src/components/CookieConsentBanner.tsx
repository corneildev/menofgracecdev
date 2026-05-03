type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

export function CookieConsentBanner({ onAccept, onDecline }: Props) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] border border-hairline bg-ink/95 backdrop-blur p-4 md:p-5">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-bone/70 text-sm font-light leading-relaxed">
          Nous utilisons des cookies de mesure et publicitaires (Meta) pour
          améliorer l'expérience et suivre les conversions.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDecline}
            className="luxury-btn px-4 py-2 text-[10px]"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="luxury-btn luxury-btn-solid px-4 py-2 text-[10px]"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
