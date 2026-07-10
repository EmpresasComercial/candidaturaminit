import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Check, Copy, Smartphone, 
  AlertCircle, Send, FileDown 
} from 'lucide-react';
import { Agendamento } from '../types';
import EmblemAngola from './EmblemAngola';
import { generateAppointmentPDF } from '../lib/pdfGenerator';

export default function PaymentStep() {
  const location = useLocation();
  const navigate = useNavigate();
  const agendamento = (location.state as { agendamento?: Agendamento })?.agendamento;

  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedEntity, setCopiedEntity] = useState(false);

  if (!agendamento) {
    return <Navigate to="/" replace />;
  }

  const copyToClipboard = (text: string, type: 'ref' | 'entity') => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    if (type === 'ref') {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else if (type === 'entity') {
      setCopiedEntity(true);
      setTimeout(() => setCopiedEntity(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    generateAppointmentPDF(agendamento);
  };

  const getWhatsAppLink = () => {
    const text = `Olá! Acabei de efetuar o agendamento da candidatura para o concurso público do Ministério do Interior no portal.%0A%0A*DADOS DE AGENDAMENTO:*%0A👤 *Nome:* ${encodeURIComponent(agendamento.nomeCompleto)}%0A📍 *Cidade:* ${encodeURIComponent(agendamento.cidade)}%0A📞 *Telefone:* ${encodeURIComponent(agendamento.telefone)}%0A💵 *Valor:* 1.250 Kz%0A%0A*DADOS DE PAGAMENTO:*%0A🎫 *Referência:* ${agendamento.referenciaMulticaixa}%0A%0AEnvio em anexo o comprovativo de pagamento para validação do agendamento and início da minha candidatura.`;
    return `https://wa.me/244928809034?text=${text}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/agendar')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#FF6D00] transition-colors mb-6 font-normal group cursor-pointer print:hidden"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Voltar para o formulário</span>
        </button>

        <div className="space-y-6">
          <div id="printable-receipt" className="hidden print:block bg-white p-8 text-black font-mono">
            <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
              <h1 className="text-lg font-bold text-[#FF6D00] uppercase">TALÃO DE AGENDAMENTO DE CANDIDATURA</h1>
              <p className="text-xs font-bold">MINISTÉRIO DO INTERIOR - REPÚBLICA DE ANGOLA</p>
              <p className="text-[10px] text-slate-500">Agendamento ID: {agendamento.id.toUpperCase()}</p>
            </div>
            
            <div className="space-y-2 text-xs border-b border-slate-200 pb-4 mb-4">
              <p><span className="text-slate-500 font-normal">Candidato:</span> {agendamento.nomeCompleto}</p>
              <p><span className="text-slate-500 font-normal">Posição de Candidatura:</span> Nº {String(agendamento.numeroOrdem).padStart(3, '0')}</p>
              <p><span className="text-slate-500 font-normal">Cidade:</span> {agendamento.cidade}</p>
              <p><span className="text-slate-500 font-normal">Telefone:</span> {agendamento.telefone}</p>
              <p><span className="text-slate-500 font-normal">Data de Emissão:</span> {new Date().toLocaleDateString('pt-AO')}</p>
              <p><span className="text-slate-500 font-normal">Valor do Serviço:</span> 1.250 Kz</p>
            </div>

            <div className="my-4 p-4 border border-slate-300 bg-slate-50 text-xs rounded-lg">
              <p className="font-bold text-center text-slate-800 mb-2">DADOS PARA PAGAMENTO MULTICAIXA</p>
              <div className="space-y-1.5">
                <p><span className="text-slate-500 font-normal">Referência:</span> {agendamento.referenciaMulticaixa}</p>
                <p><span className="text-slate-500 font-normal">Valor:</span> 1.250 Kz</p>
              </div>
            </div>

            <div className="text-center text-[9px] border-t-2 border-dashed border-slate-300 pt-4 mt-6">
              <p className="font-normal text-slate-700">Este comprovativo certifica o pedido de agendamento de suporte técnico.</p>
              <p>Após pagar, envie este talão e o comprovativo bancário para o WhatsApp +244 928809034.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/40 p-6 md:p-8 space-y-6 print:hidden"
          >
            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-slate-100">
              <EmblemAngola className="w-16 h-16" />
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#FF6D00] font-display">
                  Pagamento do Agendamento
                </h2>
                <p className="text-xs text-slate-400">
                  Efetue o pagamento de 1.250 Kz utilizando uma das opções institucionais abaixo.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Nome do Candidato</span>
                <span className="font-normal text-slate-855 text-xs sm:text-sm truncate block">{agendamento.nomeCompleto}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Posição de Candidatura</span>
                <span className="font-normal text-[#FF6D00] text-xs sm:text-sm flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-[#FF6D00] rounded-full animate-pulse"></span>
                  Nº {String(agendamento.numeroOrdem).padStart(3, '0')}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Telefone</span>
                <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.telefone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Cidade / Província</span>
                <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.cidade}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-center border-b border-slate-700 pb-3.5 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-[#FF6D00] rounded-xl p-2 text-white font-black text-xs tracking-wider font-display shrink-0">
                    MC
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white">
                      MULTICAIXA <span className="text-[#FF6D00]">Express</span>
                    </h3>
                    <p className="text-[9px] text-slate-400">Pagamento de Serviços / Referência</p>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-3.5 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Referência:</span>
                  <div className="flex items-center gap-2 font-normal">
                    <span className="text-[#FF6D00] tracking-widest text-sm">{agendamento.referenciaMulticaixa}</span>
                    <button 
                      onClick={() => copyToClipboard(agendamento.referenciaMulticaixa, 'ref')}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
                      title="Copiar Referência"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-dashed border-slate-700 pt-3.5 text-xs">
                  <span className="text-slate-400">Valor a Pagar:</span>
                  <span className="text-lg text-[#FF6D00] font-display">1.250,00 Kz</span>
                </div>
              </div>
            </div>



            <div className="w-full">
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6D00] hover:bg-[#E06000] text-white font-bold font-display h-[50px] rounded-full shadow-xs transition-all duration-300 active:scale-95 cursor-pointer text-xs"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Baixar Comprovativo</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-whatsapp-comprovativo"
                className="w-full flex items-center justify-center gap-3 bg-[#FF6D00] hover:bg-[#E06000] text-white font-bold font-display h-[54px] rounded-full shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 text-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Comprovativo pelo WhatsApp</span>
              </a>
              <p className="text-[10px] text-slate-400 mt-2 text-center mb-4">
                Número de suporte técnico: +244 928 809 034
              </p>
            </div>

            <div className="flex gap-3 bg-white border border-orange-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
              <AlertCircle className="w-5 h-5 text-[#FF6D00] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Instrução importante:</p>
                <p className="italic">
                  «Após efetuar o pagamento, envie o comprovativo através do WhatsApp para que possamos validar o pagamento e iniciar o processo da sua candidatura.»
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => navigate('/')}
                className="text-xs text-slate-400 hover:text-slate-600 underline font-normal cursor-pointer"
              >
                Fazer novo agendamento
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
