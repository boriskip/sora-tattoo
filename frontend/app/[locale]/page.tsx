import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Artists from '@/components/Artists';
import Gallery from '@/components/Gallery';
import Styles from '@/components/Styles';
import Guides from '@/components/Guides';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Force static generation
export const dynamic = 'force-static';
export const dynamicParams = false;

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Header />
      <Hero />
      <About />
      <Artists />
      <Gallery />
      <Styles />
      <Guides />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}

