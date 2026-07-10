import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';

const HomeStep = lazy(() => import('./components/HomeStep'));
const ScheduleStep = lazy(() => import('./components/ScheduleStep'));
const PaymentStep = lazy(() => import('./components/PaymentStep'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-[#FF6D00] rounded-full animate-spin"></div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header />

      <main className="flex-1 w-full bg-white">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            {/* @ts-ignore - React Router types sometimes complain about key on Routes, but it is required by AnimatePresence */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomeStep />} />
              <Route path="/agendar" element={<ScheduleStep />} />
              <Route path="/pagamento" element={<PaymentStep />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
