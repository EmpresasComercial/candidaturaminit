import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./lib/store";
import { initializeLocalStorage, userStorage } from "./lib/localStorage";

// Lazy load components
function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const Component = lazy(factory) as LazyExoticComponent<T> & {
    preload: () => Promise<{ default: T }>;
  };
  Component.preload = factory;
  return Component;
}

const QuizPage = lazyWithPreload(() => import("./components/QuizPage").then(module => ({ default: module.QuizPage })));
const ResultPage = lazyWithPreload(() => import("./components/ResultPage").then(module => ({ default: module.ResultPage })));
const DashboardPage = lazyWithPreload(() => import("./components/DashboardPage").then(module => ({ default: module.DashboardPage })));
const RankingPage = lazyWithPreload(() => import("./components/RankingPage").then(module => ({ default: module.RankingPage })));
const AdminPage = lazyWithPreload(() => import("./components/AdminPage").then(module => ({ default: module.AdminPage })));
const PlansPage = lazyWithPreload(() => import("./components/PlansPage").then(module => ({ default: module.PlansPage })));

const HomePage = lazyWithPreload(() => import("./components/HomePage"));
const SchedulePage = lazyWithPreload(() => import("./components/SchedulePage"));
const PaymentPage = lazyWithPreload(() => import("./components/PaymentPage"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { setUser, setIsLoading, user } = useAuthStore();

  useEffect(() => {
    initializeLocalStorage();
    queryClient.invalidateQueries({ queryKey: ["all-questions"] });

    const initializeAuth = () => {
      try {
        const storedUser = userStorage.getUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          const fallbackUser = userStorage.signIn("local@minint.local", "local");
          setUser(fallbackUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, setIsLoading]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900">
      <main className="flex-1 w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/planos" element={<PlansPage />} />

            <Route path="/agendar" element={<SchedulePage />} />
            <Route path="/pagamento" element={<PaymentPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage
                    history={[]}
                    statistics={null}
                    userName={user?.full_name || "Usuário"}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/simulado"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resultado"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage isAdmin={true} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900 p-1">
        <AppContent />
      </div>
    </QueryClientProvider>
  );
}
