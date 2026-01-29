/**
 * SEO Utilities for SpiderFrog
 * Includes Pixel Width Calculation and other text analysis tools.
 */

// Approximate character widths for Arial 16px (Standard Google Search Result Font)
// This is a simplified lookup table based on average rendering.
const CHAR_WIDTHS: Record<string, number> = {
    'a': 8.9, 'b': 9.8, 'c': 8.0, 'd': 9.8, 'e': 8.9, 'f': 5.3, 'g': 9.8, 'h': 9.8, 'i': 3.6,
    'j': 3.6, 'k': 8.9, 'l': 3.6, 'm': 14.2, 'n': 9.8, 'o': 9.8, 'p': 9.8, 'q': 9.8, 'r': 6.2,
    's': 8.0, 't': 5.3, 'u': 9.8, 'v': 8.9, 'w': 12.5, 'x': 8.9, 'y': 8.9, 'z': 8.0,
    'A': 11.6, 'B': 11.6, 'C': 12.5, 'D': 12.5, 'E': 11.6, 'F': 10.7, 'G': 13.3, 'H': 12.5,
    'I': 4.4, 'J': 8.9, 'K': 11.6, 'L': 9.8, 'M': 15.1, 'N': 12.5, 'O': 13.3, 'P': 11.6,
    'Q': 13.3, 'R': 12.5, 'S': 11.6, 'T': 10.7, 'U': 12.5, 'V': 11.6, 'W': 16.9, 'X': 11.6,
    'Y': 11.6, 'Z': 10.7,
    '0': 9.8, '1': 9.8, '2': 9.8, '3': 9.8, '4': 9.8, '5': 9.8, '6': 9.8, '7': 9.8, '8': 9.8, '9': 9.8,
    ' ': 4.4, '.': 4.4, ',': 4.4, '-': 5.3, '_': 8.9, '!': 4.4, '?': 8.9, '|': 4.4, '/': 5.3, '\\': 5.3,
    '(': 5.3, ')': 5.3, '[': 5.3, ']': 5.3, '{': 5.3, '}': 5.3, '<': 8.9, '>': 8.9, ':': 4.4, ';': 4.4,
    '"': 6.2, "'": 3.6, '@': 16.9, '#': 9.8, '$': 9.8, '%': 14.2, '^': 7.1, '&': 11.6, '*': 7.1, '+': 9.8,
    '=': 9.8, '~': 9.8, '`': 5.3
};

const DEFAULT_WIDTH = 8.9; // Fallback for unknown characters

/**
 * Calculates the approximate pixel width of a string string rendered in Arial 16px.
 * Used for estimating Title Tag truncation in Google Headers.
 */
export function calculatePixelWidth(text: string): number {
    if (!text) return 0;

    let width = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        width += CHAR_WIDTHS[char] || DEFAULT_WIDTH;
    }
    return Math.round(width);
}
