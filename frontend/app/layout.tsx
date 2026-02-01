import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true
});

const cormorant = Cormorant_Garamond({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="overflow-x-hidden">
      <body className={`${inter.variable} ${cormorant.variable} font-sans overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}

