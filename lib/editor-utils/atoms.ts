import { atom } from "jotai";
import type { Range } from "@tiptap/core";

export const queryAtom = atom("");
export const rangeAtom = atom<Range | null>(null);

// Writable atom for setting range
export const setRangeAtom = atom(
  null as Range | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_get: any, set: any, range: Range | null) => {
    set(rangeAtom, range);
  },
);
