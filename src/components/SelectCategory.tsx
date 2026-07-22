import { Link } from "react-router-dom";

export function SelectCategory() {
  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-4">
          Simulado sem categorias
        </p>
        <h1 className="text-4xl font-bold text-slate-950 mb-6">
          Inicie a prova aleatória
        </h1>
        <p className="text-slate-600 mb-8">
          Não é necessário escolher uma área. As questões são embaralhadas entre cultura geral, polícia, bombeiro e temas do Minint.
        </p>
        <Link
          to="/simulado"
          className="inline-flex items-center justify-center gap-2 bg-yellow-400 px-6 py-3 text-base font-semibold text-slate-950 hover:bg-yellow-500 transition"
        >
          Iniciar Prova Aleatória
        </Link>
      </div>
    </div>
  );
}
