import { useNavigate } from 'react-router-dom';
import { CalendarRange, ArrowRight, MessageSquare } from 'lucide-react';

export default function HomeStep() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[75vh] bg-white text-slate-900 px-4 sm:px-6 pt-0 pb-16">
        <div className="w-full text-center space-y-10 flex flex-col items-center">
          <div className="w-full overflow-hidden" style={{ marginTop: '-1px' }}>
            <img
              src="/LOGO.MININT.jpeg"
              alt="Banner Minint"
              className="w-full h-auto max-w-none object-cover"
            />
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-[#FF6D00] leading-tight"
              id="main-portal-title"
            >
              Não sabem fazer inscrição ou estão com dificuldade? Nós vamos fazer.
            </h1>
            
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/agendar')}
              id="btn-agendar-agora"
              className="group relative flex items-center justify-center gap-3 bg-[#FF6D00] hover:bg-[#E06000] text-white font-bold font-display px-12 py-4 rounded-full shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 active:scale-95 cursor-pointer text-base md:text-lg min-w-[240px] h-[54px]"
            >
              <span>Pagar Minha inscrição agora</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
            </button>
          </div>

          <div className="max-w-3xl text-left text-sm text-slate-500 space-y-6 mx-auto px-4 sm:px-0">
            <div>
              <p className="font-semibold text-[#FF6D00] text-lg sm:text-xl">Objetivo do Portal:</p>
              <p>
                O portal oferece ajuda para fazer a sua inscrição. Se não souber ou não conseguir inscrever-se online, nós fazemos isso por si. Está apenas a pagar <span className="text-red-600 font-semibold">1.000 Kz</span> e pode agendar já a sua inscrição online para a candidatura ao concurso público do Ministério do Interior.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#FF6D00] text-lg sm:text-xl">Informações do Serviço:</p>
              <p>
                O valor cobrado é de <span className="text-red-600 font-semibold">1.000 Kz</span> e refere-se exclusivamente ao serviço de fazer a sua inscrição. A candidatura será feita no portal oficial do Ministério do Interior, dentro das regras instituídas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <CalendarRange className="w-4 h-4 text-[#FF6D00]" />
            <span>Atendimento agendado e organizado por ordem de chegada</span>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/244928809034"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 min-w-[160px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-2xl shadow-green-500/20 transition-transform duration-200 hover:-translate-y-1"
        aria-label="Puxar no WhatsApp"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="text-sm font-semibold">Puxar no WhatsApp</span>
      </a>
    </div>
  );
}
