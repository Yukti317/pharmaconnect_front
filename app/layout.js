import { Inter, Roboto_Slab } from 'next/font/google';
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import { Toaster } from '@/components/ui/sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "PharmaConnect Crm",
};

export const robotoSlab = Roboto_Slab({
  weight: ['600'], // You can add more weights if needed, e.g., ['400', '600']
  subsets: ['latin'],
  variable: '--font-roboto-slab',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className='background-color'>
        <main >
          {children}
          <Toaster/>
        </main>
      </body>
    </html>
  );
}
