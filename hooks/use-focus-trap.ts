"use client";
import { useEffect, type RefObject } from "react";
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const container = ref.current;
    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex="0"]'));
    focusables()[0]?.focus({ preventScroll: true });
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = focusables(), first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    container.addEventListener("keydown", handleKey);
    return () => { container.removeEventListener("keydown", handleKey); previous?.focus({ preventScroll: true }); };
  }, [active, ref]);
}
