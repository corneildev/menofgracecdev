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
  faBolt,
  faFire,
  faGift,
  faLock,
  faCreditCard,
  faEye,
  faTag,
  faCheck,
  faQuoteLeft,
  faShareNodes,
  faCircleQuestion,
  faAward,
  faGem,
  faHandshake,
  faPercent,
  faUsers,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
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
  "star-o": faStarRegular,
  check: faCircleCheck,
  "check-simple": faCheck,
  warning: faCircleExclamation,
  plus: faPlus,
  minus: faMinus,
  trash: faTrashCan,
  location: faLocationDot,
  clock: faClock,
  globe: faGlobe,
  bolt: faBolt,
  fire: faFire,
  gift: faGift,
  lock: faLock,
  card: faCreditCard,
  eye: faEye,
  tag: faTag,
  quote: faQuoteLeft,
  share: faShareNodes,
  question: faCircleQuestion,
  award: faAward,
  gem: faGem,
  handshake: faHandshake,
  percent: faPercent,
  users: faUsers,
  "thumbs-up": faThumbsUp,
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
