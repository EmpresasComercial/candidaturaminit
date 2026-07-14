import { ChevronDown, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer-section" className="w-full bg-white border-t border-slate-100 py-12 px-6 md:px-12 mt-16 print:hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="pt-8 border-t border-slate-200 flex flex-col items-center text-center space-y-4 text-xs text-slate-500">
          <p className="font-normal text-slate-800">Governo de Angola</p>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-500 font-normal">
            <span className="hover:text-slate-855 cursor-pointer transition-colors">Política de Privacidade</span>
            <span className="hover:text-slate-855 cursor-pointer transition-colors">Termos de serviço</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 font-normal">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Selecione o idioma</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          <p className="text-[10px] text-slate-400 pt-2">
            © {new Date().getFullYear()} Governo da República de Angola • Portal de Agendamento Oficial
          </p>
        </div>

      </div>
    </footer>
  );
}
