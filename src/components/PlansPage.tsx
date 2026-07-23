import { useState } from "react";
import { Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { subscriptionStorage } from "../lib/localStorage";

export function PlansPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const activatePlan = (plan: "iniciante" | "medio" | "pro") => {
    if (!user) {
      navigate("/");
      return;
    }

    setUser({
      ...user,
      active_plan: plan,
      updated_at: new Date().toISOString(),
    });
    navigate("/simulado");
  };

  const handleConfirmSubscription = () => {
    activatePlan("iniciante");
    setShowPaymentModal(false);
  };

  const handleInicianteClick = () => {
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-[#04162e] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_-40px_rgba(255,255,255,0.18)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-yellow-300 font-semibold">Planos de Investimento</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Escolha o plano ideal para treinar</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Voltar
            </button>
          </div>
          <p className="mt-6 max-w-3xl text-slate-300 leading-7">
            Compare os planos disponíveis e selecione a opção que melhor se encaixa no seu ritmo de estudo. Cada plano oferece benefícios exclusivos para ajudar na preparação da prova.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_-40px_rgba(250,204,21,0.45)] transition hover:-translate-y-1 sm:p-7">
            <div className="mb-5">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-yellow-900">
                Plano Iniciante
              </span>
              <p className="mt-4 text-4xl font-bold text-slate-950">500 Kz</p>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p>Depósito inicial único</p>
              <p>Acesso ilimitado à plataforma</p>
              <p>1 a 10 questões aleatórias por sessão</p>
              <p>30 segundos por questão</p>
              <p>Correção automática ao final</p>
              <p>Acompanhamento de desempenho</p>
            </div>
            <button
              type="button"
              onClick={handleInicianteClick}
              className="mt-6 w-full rounded-full bg-yellow-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-md shadow-yellow-500/20 transition hover:bg-yellow-400"
            >
              Assinar Plano Iniciante
            </button>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_-40px_rgba(56,189,248,0.25)] transition hover:-translate-y-1 sm:p-7">
            <div className="mb-5">
              <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-900">
                Plano Médio
              </span>
              <p className="mt-4 text-4xl font-bold text-slate-950">1.000 Kz</p>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p>Acesso ilimitado à plataforma</p>
              <p>1 a 30 questões aleatórias por sessão</p>
              <p>20 segundos por questão</p>
              <p>Estatísticas detalhadas de desempenho</p>
              <p>Acesso a simulados de dificuldade intermédia</p>
            </div>
            <button
              type="button"
              onClick={() => activatePlan("medio")}
              className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Comprar Plano Médio
            </button>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_-40px_rgba(248,113,113,0.25)] transition hover:-translate-y-1 sm:p-7">
            <div className="mb-5">
              <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose-900">
                Plano Pro Avançado
              </span>
              <p className="mt-4 text-4xl font-bold text-slate-950">1.500 Kz</p>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p>Acesso ilimitado a todos os recursos</p>
              <p>1 a 30 questões aleatórias por sessão</p>
              <p>10 segundos por questão</p>
              <p>Simulados de nível avançado</p>
              <p>Relatórios completos de desempenho</p>
              <p>Acesso antecipado a novos simulados</p>
            </div>
            <button
              type="button"
              onClick={() => activatePlan("pro")}
              className="mt-6 w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-500"
            >
              Comprar Plano Pro Avançado
            </button>
          </div>
        </div>

        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-slate-900 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Assinar Plano Iniciante</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Referência de Pagamento</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-full bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                  Fechar
                </button>
              </div>

              <p className="mb-6 text-slate-600">
                Para assinar o Plano Iniciante, utilize os dados abaixo no pagamento.
              </p>

              <div className="space-y-4 rounded-3xl bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-yellow-50 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Código de referência</p>
                    <p className="mt-2 text-3xl font-semibold">00930</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText("00930")}
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400"
                  >
                    <Copy className="h-4 w-4" /> Copiar
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-yellow-50 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Número de pagamento</p>
                    <p className="mt-2 text-3xl font-semibold">928809034</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText("928809034")}
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400"
                  >
                    <Copy className="h-4 w-4" /> Copiar
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleConfirmSubscription}
                  className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Confirmar Assinatura
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full rounded-full bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
