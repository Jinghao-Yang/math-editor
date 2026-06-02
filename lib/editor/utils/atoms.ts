import { atom } from "jotai";

export const queryAtom = atom<string>("");
export const rangeAtom = atom<{ from: number; to: number } | null>(null);