"use client";

import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
    return (
        <SessionProvider>
            <ChatProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </ChatProvider>
        </SessionProvider>
    );
}
