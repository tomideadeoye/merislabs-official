import type { ComponentType } from 'react';
import type { RegisteredSlideData } from './types';
import { TitleSlide } from './title-slide';
import { ContentSlide } from './content-slide';
import { TwoColumnSlide } from './two-column-slide';
import { QuoteSlide } from './quote-slide';
import { StatsSlide } from './stats-slide';
import { OutcomesSlide } from './outcomes-slide';
import { RoadmapSlide } from './roadmap-slide';
import { ComparisonSlide } from './comparison-slide';
import { AreasSlide } from './areas-slide';
import { ThankYouSlide } from './thankyou-slide';

export type SlideComponent = ComponentType<{
  slide: RegisteredSlideData
  slideNumber: number
  totalSlides: number
}>;

const registry: Record<string, SlideComponent> = {
  title:      TitleSlide as SlideComponent,
  content:    ContentSlide as SlideComponent,
  twoColumn:  TwoColumnSlide as SlideComponent,
  quote:      QuoteSlide as SlideComponent,
  stats:      StatsSlide as SlideComponent,
  outcomes:   OutcomesSlide as SlideComponent,
  roadmap:    RoadmapSlide as SlideComponent,
  comparison: ComparisonSlide as SlideComponent,
  areas:      AreasSlide as SlideComponent,
  thankyou:   ThankYouSlide as SlideComponent,
};

export function getSlideComponent(type: string): SlideComponent | undefined {
  return registry[type];
}

export function registerSlideType(type: string, component: SlideComponent) {
  registry[type] = component;
}

export const REGISTERED_TYPES = Object.keys(registry);
