import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faUser,
  faHeart,
  faCartShopping,
  faMagnifyingGlass,
  faBars,
  faXmark,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faTruck,
  faRotateLeft,
  faShieldHalved,
  faScissors,
  faRulerCombined,
  faStar,
  faCircleCheck,
  faCircleExclamation,
  faPlus,
  faMinus,
  faTrashCan,
  faLocationDot,
  faClock,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faWhatsapp, faInstagram, faFacebookF, faTiktok } from "@fortawesome/free-brands-svg-icons";

const ICONS = {
  sun: faSun,
  moon: faMoon,
  user: faUser,
  heart: faHeart,
  "heart-o": faHeartRegular,
  cart: faCartShopping,
  search: faMagnifyingGlass,
  bars: faBars,
  close: faXmark,
  "chevron-down": faChevronDown,
  "chevron-right": faChevronRight,
  "chevron-left": faChevronLeft,
  truck: faTruck,
  "rotate-left": faRotateLeft,
  shield: faShieldHalved,
  scissors: faScissors,
  ruler: faRulerCombined,
  star: faStar,
  check: faCircleCheck,
  warning: faCircleExclamation,
  plus: faPlus,
  minus: faMinus,
  trash: faTrashCan,
  location: faLocationDot,
  clock: faClock,
  globe: faGlobe,
  whatsapp: faWhatsapp,
  instagram: faInstagram,
  facebook: faFacebookF,
  tiktok: faTiktok,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className,
  size,
  "aria-label": ariaLabel,
}: {
  name: IconName;
  className?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "2x";
  "aria-label"?: string;
}) {
  return (
    <FontAwesomeIcon
      icon={ICONS[name]}
      className={className}
      size={size}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
