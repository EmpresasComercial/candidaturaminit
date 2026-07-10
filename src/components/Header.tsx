import { useLocation, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import EmblemAngola from './EmblemAngola';

const stepFromPath: Record<string, string> = {
  '/': 'home',
  '/agendar': 'schedule',
  '/pagamento': 'payment',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = stepFromPath[location.pathname] || 'home';

  return (
    <header className="w-full bg-white border-b border-slate-100 py-4.5 px-6 md:px-12 flex justify-between items-center print:hidden">
      <div 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 cursor-pointer group"
        id="header-brand-logo"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:bg-slate-55 transition-all shrink-0">
          <EmblemAngola className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xs font-black text-slate-900 font-display leading-tight uppercase tracking-widest">
            Portal de Agendamento
          </h1>
          <p className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">
            Ministério do Interior • Angola
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === 'home' ? 'bg-[#FF6D00] scale-125 shadow-sm shadow-orange-500/20' : 'bg-slate-200'}`}></span>
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === 'schedule' ? 'bg-[#FF6D00] scale-125 shadow-sm shadow-orange-500/20' : 'bg-slate-200'}`}></span>
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === 'payment' ? 'bg-[#FF6D00] scale-125 shadow-sm shadow-orange-500/20' : 'bg-slate-200'}`}></span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 font-normal uppercase tracking-wider bg-white border border-slate-100 px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Suporte 24/7</span>
        </div>
      </div>
    </header>
  );
}
