
'use client';

/**
 * A generic function to safely get an item from localStorage.
 * It handles parsing JSON and returns a default value if the item doesn't exist or if there's an error.
 * @param key The key of the item in localStorage.
 * @param defaultValue The default value to return if the item is not found.
 * @returns The parsed item from localStorage or the default value.
 */
export function getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const storedValue = window.localStorage.getItem(key);
        if (storedValue === null) {
            return defaultValue;
        }
        return JSON.parse(storedValue) as T;
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * A generic function to safely set an item in localStorage.
 * It handles stringifying the value.
 * @param key The key of the item in localStorage.
 * @param value The value to store.
 */
export function setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
    }
}

/**
 * Initializes an item in localStorage if it doesn't already exist.
 * @param key The key of the item in localStorage.
 * @param defaultValue The default value to set if the item is not found.
 */
export function initializeItem<T>(key: string, defaultValue: T): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const storedValue = window.localStorage.getItem(key);
        if (storedValue === null) {
            setItem(key, defaultValue);
        }
    } catch (error) {
        console.error(`Error initializing localStorage for key "${key}":`, error);
    }
}
