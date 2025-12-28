// Shared utility functions for type-safe property access from CaseWithMetadata
// This module provides safe getters for properties that may not exist on all case types
// (AppealsItem, CasesByEcobankItem, MattersAgainstBankItem)

import { CaseWithMetadata } from '@merislabs/types';

/**
 * Get a value from an object using multiple possible property keys
 * Returns the first non-null value found, or null if none found
 */
export const getVal = (obj: CaseWithMetadata, ...keys: string[]): string | number | null => {
    for (const key of keys) {
        if (key in obj && (obj as unknown as Record<string, unknown>)[key] != null) {
            return (obj as unknown as Record<string, unknown>)[key] as string | number;
        }
    }
    return null;
};

/**
 * Get a string value from an object, with fallback to 'N/A'
 */
export const getStr = (obj: CaseWithMetadata, ...keys: string[]): string => {
    const val = getVal(obj, ...keys);
    return val != null ? String(val) : 'N/A';
};

/**
 * Get a numeric value from an object, with fallback to 0
 */
export const getNum = (obj: CaseWithMetadata, ...keys: string[]): number => {
    const val = getVal(obj, ...keys);
    return typeof val === 'number' ? val : (typeof val === 'string' ? parseFloat(val) || 0 : 0);
};

/**
 * Escape a string value for CSV output
 */
export const csvEscape = (value: string): string => {
    return `"${value.replace(/"/g, '""')}"`;
};
