export function safelyResetPointerEvents(delay = 100) {
  // Jalankan setelah transition selesai (gunakan rAF + timeout agar stabil)
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (document?.body?.style?.pointerEvents === 'none') {
        document.body.style.pointerEvents = '';
      }
    }, delay);
  });
}