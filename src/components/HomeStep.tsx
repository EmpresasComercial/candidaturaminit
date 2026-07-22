import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomeStep() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#04162e] text-white p-1">
      <div className="relative overflow-hidden h-full rounded-[1.5rem]">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,209,0,0.2),_transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_35%)]" />

        <header className="relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 text-sm uppercase tracking-[0.35em] text-slate-300 font-semibold">
              <span className="inline-flex h-10 items-center justify-center rounded-full bg-white/10 px-3 py-2 text-slate-100">MININT</span>
              <span>Ministério do Interior</span>
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid gap-10 xl:grid-cols-[1.3fr_0.9fr] items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-yellow-100">
                Concurso público de ingresso externo
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Simulação da Prova Online <span className="text-yellow-300">MININT</span> <span className="text-yellow-400">2026</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Recrutamento de 7.682 novas Agentes para a Quadro de Pessoal do Ministério do Interior.
                As candidaturas decorrem exclusivamente através do portal eletrônico e são acompanhadas do envio de documentos solicitados no processo.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/simulado')}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-300"
                >
                  Iniciar Prova
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/planos')}
                  className="inline-flex items-center justify-center rounded-full bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Consultar Planos
                </button>
              </div>

            </div>

            <div className="rounded-[2rem] bg-white/5 p-8 shadow-[0_40px_120px_-50px_rgba(255,209,0,0.25)] backdrop-blur-xl">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-950/70 p-6 text-slate-100">
                  <p className="text-xs uppercase tracking-[0.35em] text-yellow-300 font-semibold">Prova online</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Simulação da Prova Online MININT 2026</h2>
                  <p className="mt-4 text-slate-300 leading-7">
                    Treine com questões atualizadas e garanta ritmo para o concurso do Ministério do Interior.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] overflow-hidden bg-[#07152a] shadow-[0_35px_90px_-35px_rgba(0,0,0,0.45)]">
            <img
              src="/pessoasDeAmostra.jpeg"
              alt="Equipe MININT"
              className="w-full object-cover max-h-[320px]"
            />
          </div>

        </main>
      </div>
    </div>
  );
}
