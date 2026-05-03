import { useWishlist } from "@/context/WishlistContext";

type Props = {
  productId: string;
  className?: string;
  variant?: "overlay" | "inline";
};

<<<<<<< HEAD
export function WishlistButton({ productId, className = "", variant = "overlay" }: Props) {
=======
export function WishlistButton({
  productId,
  className = "",
  variant = "overlay",
}: Props) {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  const { has, toggle, ready } = useWishlist();
  const active = ready && has(productId);

  const base =
    variant === "overlay"
      ? "absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center bg-ink/60 backdrop-blur-sm border border-hairline hover:border-bone transition-colors"
      : "h-10 w-10 flex items-center justify-center border border-hairline hover:border-bone transition-colors";

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`${base} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        style={{ color: active ? "var(--color-bone)" : "var(--color-bone)" }}
      >
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 3.1c0 5.6-7.5 10.2-7.5 10.2Z" />
      </svg>
    </button>
  );
}
