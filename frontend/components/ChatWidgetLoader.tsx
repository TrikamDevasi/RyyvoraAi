'use client';

// This thin wrapper marks the file as a Client Component,
// allowing dynamic(() => ..., { ssr: false }) to work inside the App Router layout.
import dynamic from 'next/dynamic';

const AIChatWidget = dynamic(() => import('./AIChatWidget'), { ssr: false });

export default function ChatWidgetLoader() {
    return <AIChatWidget />;
}
