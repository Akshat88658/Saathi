import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import BecomeSaathi from './components/BecomeSaathi';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <div className="noise-overlay" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Benefits />
        <BecomeSaathi />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
