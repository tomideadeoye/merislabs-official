'use client';
import { createContext, useContext } from 'react';

export interface NavigationContextProps {
    goToSlideById: (id: string) => void;
    currentSlide: number;
    totalSlides: number;
    viewMode: 'scroll' | 'deck';
}

export const NavigationContext = createContext<NavigationContextProps | null>(null);

export const useDeckNavigation = () => {
    const ctx = useContext(NavigationContext);
    if (!ctx) {
        return { goToSlideById: () => { }, currentSlide: 0, totalSlides: 0, viewMode: 'scroll' as const };
    }
    return ctx;
};
