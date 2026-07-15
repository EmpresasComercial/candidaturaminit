import { useLocation, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPaymentPage = location.pathname === '/pagamento';

  return (
    <header className="w-full bg-white border-b border-slate-100 py-4.5 px-6 md:px-12 flex justify-between items-center print:hidden">
      <div
        onClick={() => !isPaymentPage && navigate('/')}
        className={`flex items-center gap-3 ${isPaymentPage ? 'cursor-default' : 'cursor-pointer group'}`}
        id="header-brand-logo"
      >
        <div>
          <h1 className="text-xs font-black text-slate-900 font-display leading-tight uppercase tracking-widest">
            Portal de Agendamento
          </h1>
          <p className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">
            Ministério do Interior • Angola
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 font-normal uppercase tracking-wider bg-white border border-slate-100 px-3 py-1.5 rounded-full">
        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Suporte 24/7</span>
      </div>
    </header>
  );
}
