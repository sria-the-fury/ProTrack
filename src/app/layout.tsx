import type { Metadata } from 'next';
import './globals.css';
import { ProjectProvider } from '@/context/ProjectContext';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'ProTrack',
  description: 'A simple project tracking application built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ProjectProvider>
          {children}
        </ProjectProvider>
        <Toaster />
      </body>
    </html>
  );
}
