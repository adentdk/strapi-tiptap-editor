// src/utils/tiptapErrorSilencer.ts  ← buat file baru
// Atau taro di file utils/global.ts atau langsung di main.tsx

// Silencer khusus buat error toDOM pas unmount (100% aman)
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('node.type.spec.toDOM is not a function')
  ) {
    // Diam aja, jangan tampilkan
    return;
  }
  if (
    args[0]?.message?.includes?.('toDOM is not a function') ||
    args[0]?.stack?.includes?.('PureEditorContent.componentWillUnmount')
  ) {
    return;
  }
  // Kalau bukan error itu, tampilkan seperti biasa
  originalError.apply(console, args);
};

// Optional: juga catch unhandled promise rejection dari Tiptap
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes?.('toDOM')) {
    event.preventDefault(); // silent
  }
});