// src/components/TiptapErrorBoundary.tsx
import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class TiptapErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // Ini yang nangkep error di render phase (termasuk unmount cleanup)
  static getDerivedStateFromError(error: any) {
    // Cek apakah error dari Tiptap unmount
    return { hasError: true }
  }

  // Optional: log error ke Sentry atau console
  componentDidCatch(error: Error, info: any) {
    if (error.message.includes('toDOM')) {
      // Bisa kirim ke Sentry kalau mau
      // Sentry.captureException(error, { tags: { tiptap: 'unmount' } });
      return;
    }
    console.error('Unhandled error di TiptapErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div style={{ padding: 16, color: '#666' }}>Editor ditutup.</div>;
    }
    return this.props.children;
  }
}