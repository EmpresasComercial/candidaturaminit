import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

export function InvestmentPlans() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

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
              onClick={() => activatePlan("iniciante")}
              className="mt-6 w-full rounded-full bg-yellow-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-md shadow-yellow-500/20 transition hover:bg-yellow-400"
            >
              Comprar Plano Iniciante
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

      </div>
    </div>
  );
}
