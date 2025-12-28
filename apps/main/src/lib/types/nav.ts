// Navigation types for the application

export interface NavItem {
  title: string;
  href: string;
  id?: string; // Optional, can be used for keys if needed
  link?: string; // Optional, for legacy compatibility
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
