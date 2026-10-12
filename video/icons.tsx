import { Banknote, BookOpen, Calendar, Camera, ChartColumn, CircleCheck, Clock, Coffee, CreditCard, Gift, Globe, Heart, Hourglass, House, Layers, Leaf, Lightbulb, Lock, Mail, MapPin, Megaphone, MessageCircle, Music, Package, Percent, Phone, QrCode, Rocket, Search, ShieldCheck, Shirt, ShoppingBag, Smartphone, Sparkles, Star, Tag, TrendingUp, Truck, Users, Utensils, Wallet, Wifi, Wrench, Zap, type LucideIcon } from "lucide-react";

// Daftar ikon yang boleh dipilih planner (field icon). Nama = kunci di schema.
export const ICONS = {
  sparkles: Sparkles, zap: Zap, coffee: Coffee, utensils: Utensils, shirt: Shirt, "shopping-bag": ShoppingBag, package: Package, tag: Tag, percent: Percent, gift: Gift,
  calendar: Calendar, clock: Clock, hourglass: Hourglass, "map-pin": MapPin, truck: Truck, house: House, phone: Phone, mail: Mail, "message-circle": MessageCircle, megaphone: Megaphone,
  heart: Heart, star: Star, users: Users, leaf: Leaf, lightbulb: Lightbulb, rocket: Rocket, camera: Camera, music: Music, "book-open": BookOpen, search: Search,
  "credit-card": CreditCard, wallet: Wallet, banknote: Banknote, "qr-code": QrCode, smartphone: Smartphone, wifi: Wifi, lock: Lock, "shield-check": ShieldCheck, "circle-check": CircleCheck,
  "trending-up": TrendingUp, "chart-column": ChartColumn, layers: Layers, globe: Globe, wrench: Wrench,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as [IconName, ...IconName[]];

export function SceneIcon({ name, ...props }: { name?: string; size?: number; strokeWidth?: number }) {
  const Icon: LucideIcon = name && name in ICONS ? ICONS[name as IconName] : Sparkles;
  return <Icon {...props} />;
}
