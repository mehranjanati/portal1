import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const DEFAULT_APP_HASH = "#/dashboard";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function normalizeAppHash(hash?: string | null) {
	const raw = (hash ?? "").trim();

	if (raw === "" || raw === "#" || raw === "#/") {
		return DEFAULT_APP_HASH;
	}

	if (raw.startsWith("#/")) {
		return raw;
	}

	if (raw.startsWith("#")) {
		return `#/${raw.slice(1).replace(/^\/+/, "")}`;
	}

	return `#/${raw.replace(/^\/+/, "")}`;
}

export function currentAppHash() {
	if (typeof window === "undefined") {
		return DEFAULT_APP_HASH;
	}

	return normalizeAppHash(window.location.hash);
}

export function appHashToPageName(hash?: string | null) {
	return normalizeAppHash(hash).replace("#/", "").split("?")[0] || "dashboard";
}

export type WithElementRef<Props = Record<string, unknown>, Ref = HTMLElement> = Props & {
	ref?: Ref | null;
};
