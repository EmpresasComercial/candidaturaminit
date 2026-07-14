import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeStep from './components/HomeStep';
import ScheduleStep from './components/ScheduleStep';
import PaymentStep from './components/PaymentStep';

export default function App() {
  const location = useLocation();
  const isPaymentPage = location.pathname === '/pagamento';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      {!isPaymentPage && <Header />}

      <main className="flex-1 w-full bg-white">
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<HomeStep />} />
              <Route path="/agendar" element={<ScheduleStep />} />
              <Route path="/pagamento" element={<PaymentStep />} />
            </Routes>
          </div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
