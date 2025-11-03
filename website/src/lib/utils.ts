import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dbg from 'debug';
const debug = dbg('app:utils:utils');

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function assert(condition: unknown, message?: string): asserts condition {
	if (!condition) {
		debug('Stack trace: ', new Error().stack);
		throw new Error(message ?? 'Assertion failed');
	}
}
