'use client';

import Link from 'next/link';

export default function AdminMovedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Panel Moved</h1>
        <p className="text-muted-foreground">The admin panel is now located at <Link href="/adminpanel" className="text-primary underline">/adminpanel</Link>.</p>
      </div>
    </div>
  );
}
