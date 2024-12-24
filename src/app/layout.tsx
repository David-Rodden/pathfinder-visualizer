import './globals.css';
import { Poppins } from 'next/font/google';
import React from 'react';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

export const metadata = {
    title: 'Pathfinding Visualizer',
    description: 'Visualize pathfinding algorithms dynamically.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className={poppins.className}>{children}</div>;
}
