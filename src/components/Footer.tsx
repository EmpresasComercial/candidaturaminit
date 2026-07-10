import { Info, ShieldAlert, FileCheck, ChevronDown, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer-section" className="w-full bg-white border-t border-slate-100 py-12 px-6 md:px-12 mt-16 print:hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-[#FF6D00] shrink-0" />
            <h2 className="text-xs font-black tracking-wider text-slate-800 uppercase font-display">
              Informações Importantes & Termos do Serviço
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-4">
              <p className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="font-normal text-slate-900 block mb-1.5">Objetivo do Portal:</span>
                Este portal destina-se exclusivamente ao agendamento do serviço de apoio à candidatura para o concurso público do Ministério do Interior.
              </p>
              
              <p className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="font-normal text-slate-900 block mb-1.5">Inclusão Digital & Apoio:</span>
                O objetivo é auxiliar pessoas que possuem os requisitos necessários para concorrer, mas não têm telefone, computador ou experiência para realizar a inscrição online.
              </p>
              
              <p className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <span className="font-normal text-slate-900 block mb-1.5">Taxa de Assistência:</span>
                  O valor cobrado refere-se apenas ao serviço de assistência na realização da candidatura. Esse pagamento não garante vaga, aprovação ou qualquer benefício no concurso.
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <span className="font-normal text-slate-900 block mb-1.5">Portal Oficial:</span>
                  A candidatura será realizada através do portal oficial do Ministério do Interior, respeitando todas as regras estabelecidas pela instituição.
                </span>
              </p>
              
              <p className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="font-normal text-slate-900 block mb-1.5">Requisitos de Candidatura:</span>
                Para utilizar este serviço, o candidato deve possuir os documentos exigidos (como Bilhete de Identidade e demais documentos solicitados pelo concurso) e cumprir os requisitos definidos pelo Ministério, incluindo a faixa etária estabelecida.
              </p>
            </div>
          </div>
        </div>

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
