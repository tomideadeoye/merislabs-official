import type { BrandConfig, PageType } from '../types';

export interface TemplateDefinition {
  name: string;
  renderPage(page: PageType, brand: BrandConfig): React.ReactNode;
}

import { indigo } from './indigo';
import { professional } from './professional';

const registry: Record<string, TemplateDefinition> = {
  indigo,
  professional,
};

export function getTemplate(name: string): TemplateDefinition {
  const t = registry[name];
  if (!t) throw new Error(`Template "${name}" not found. Available: ${Object.keys(registry).join(', ')}`);
  return t;
}

export function listTemplates(): { id: string; name: string }[] {
  return Object.entries(registry).map(([id, t]) => ({ id, name: t.name }));
}
