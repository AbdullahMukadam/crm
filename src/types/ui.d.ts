import type { LucideIcon } from 'lucide-react';

// Defines the shape of a navigation item for type safety
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}