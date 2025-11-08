import { useCallback, useRef } from "react";

/**
 * useDebounceCallback
 * Membuat callback yang akan dijalankan setelah delay tertentu
 * sejak terakhir kali dipanggil.
 *
 * @param callback - fungsi yang ingin didebounce
 * @param delay - waktu tunggu (ms) sebelum callback dijalankan
 */
export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Bersihkan timeout sebelumnya
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Buat timeout baru
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
}
