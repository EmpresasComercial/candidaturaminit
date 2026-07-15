import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import HomeStep from './components/HomeStep';

function lazyWithPreload<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  const Component = lazy(factory) as LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };
  Component.preload = factory;
  return Component;
}

const ScheduleStep = lazyWithPreload(() => import('./components/ScheduleStep'));
const PaymentStep = lazyWithPreload(() => import('./components/PaymentStep'));

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
    window.scrollTo({ top: 0 });

    if (location.pathname === '/') {
      ScheduleStep.preload();
    }
    if (location.pathname === '/agendar') {
      PaymentStep.preload();
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      <main className="flex-1 w-full bg-white">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomeStep />} />
            <Route path="/agendar" element={<ScheduleStep />} />
            <Route path="/pagamento" element={<PaymentStep />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
