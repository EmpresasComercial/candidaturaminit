import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Check, Copy, Smartphone, 
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
  const [showSummary, setShowSummary] = useState(false);

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

  const isPresencial = agendamento.modalidadePagamento === 'presencial';
  const isMulticaixa = agendamento.modalidadePagamento === 'multicaixa';

  const instructionsContent = isMulticaixa ? (
    <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
      <p className="font-bold text-slate-800">INSTRUÇÕES:</p>
      <p>Pagamento Multicaixa Express.</p>
      <p>O comprovativo de Talão de Agendamento da inscrição online ao concurso do Ministério do Interior foi gerado com sucesso.</p>
      <p className="font-semibold text-slate-800">Procedimento:</p>
      <p className="font-semibold">1. Acesse o seu Multicaixa Express</p>
      <p className="font-semibold">2. Insira a referência ou número de entidade gerado pela plataforma</p>
      <p className="font-semibold">3. Efetue o pagamento no valor de 1.250,00 KZ</p>
      <p className="font-semibold">4. Faça a captura do talão de pagamento emitido pelo Multicaixa Express</p>
      <p className="font-semibold">5. Envie o comprovativo de pagamento para este WhatsApp: 928 80 90 34</p>
      <p>Após a confirmação do pagamento, deverá nos fornecer: Bilhete de Identidade em PDF e Certificado em PDF.</p>
      <p>No dia 16 faremos a sua inscrição.</p>
      <p>Obrigado por ter concluído o agendamento.</p>
    </div>
  ) : (
    <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
      <p className="font-bold text-slate-800">INSTRUÇÕES:</p>
      <p>Pagamento Presencial.</p>
      <p>O pagamento refere-se ao serviço de inscrição online para a candidatura do Ministério do Interior.</p>
      <p>Instruções: Guarde este comprovativo e traga-o no dia 16 em que ocorrerá a candidatura, para confirmar o seu agendamento e efetuar o pagamento.</p>
      <p>Muito obrigado por confiar em nós. Desejamos boa sorte!</p>
    </div>
  );

  const getWhatsAppLink = () => {
    const pagamentoTexto = isMulticaixa
      ? `🎫 *Referência:* ${agendamento.referenciaMulticaixa}`
      : '📍 *Modalidade:* Pagamento presencial no local';

    const text = `Olá! Acabei de efetuar o agendamento da candidatura para o concurso público do Ministério do Interior no portal.%0A%0A*DADOS DE AGENDAMENTO:*%0A👤 *Nome:* ${encodeURIComponent(agendamento.nomeCompleto)}%0A📍 *Província de Naturalidade:* ${encodeURIComponent(agendamento.provinciaNaturalidade)}%0A📍 *Província de Candidatura:* ${encodeURIComponent(agendamento.provinciaCandidatura)}%0A🏢 *Órgão:* ${encodeURIComponent(agendamento.orgao)}%0A🧑 *Idade:* ${encodeURIComponent(String(agendamento.idade))}%0A⚧ *Gênero:* ${encodeURIComponent(agendamento.genero)}%0A📏 *Altura:* ${encodeURIComponent(`${agendamento.altura.toFixed(2)} m`)}%0A💵 *Valor:* 1.250 Kz%0A%0A*DADOS DE PAGAMENTO:*%0A${encodeURIComponent(pagamentoTexto)}%0A%0AEnvio em anexo o comprovativo de pagamento para validação do agendamento e início da minha candidatura.`;
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
        <div className="space-y-6">
          <div id="printable-receipt" className="hidden print:block bg-white p-8 text-black font-mono">
            <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
              <h1 className="text-lg font-bold text-[#FF6D00] uppercase">TALÃO DE AGENDAMENTO DE CANDIDATURA</h1>
              <p className="text-xs font-bold">MINISTÉRIO DO INTERIOR - REPÚBLICA DE ANGOLA</p>
              <p className="text-[10px] text-slate-500">Agendamento ID: {agendamento.id.toUpperCase()}</p>
            </div>
            
            <div className="space-y-2 text-xs border-b border-slate-200 pb-4 mb-4">
              <p><span className="text-slate-500 font-normal">Candidato:</span> {agendamento.nomeCompleto}</p>
              <p><span className="text-slate-500 font-normal">Nº de Candidatura:</span> {String(agendamento.numeroOrdem).padStart(3, '0')}</p>
              <p><span className="text-slate-500 font-normal">Província de Naturalidade:</span> {agendamento.provinciaNaturalidade}</p>
              <p><span className="text-slate-500 font-normal">Província de Candidatura:</span> {agendamento.provinciaCandidatura}</p>
              <p><span className="text-slate-500 font-normal">Órgão:</span> {agendamento.orgao}</p>
              <p><span className="text-slate-500 font-normal">Idade:</span> {agendamento.idade} anos</p>
              <p><span className="text-slate-500 font-normal">Gênero:</span> {agendamento.genero}</p>
              <p><span className="text-slate-500 font-normal">Altura:</span> {agendamento.altura.toFixed(2)} m</p>
              {agendamento.comentario && (
                <p><span className="text-slate-500 font-normal">Comentário:</span> {agendamento.comentario}</p>
              )}
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
              <div className="text-left text-[10px] mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                {instructionsContent}
              </div>
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
                  Comprovativo de Agendamento
                </h2>
                <p className="text-xs text-slate-400">
                  {isMulticaixa
                    ? 'O seu comprovativo de agendamento foi gerado com sucesso. Para concluir o processo, efetue o pagamento mediante a referência Multicaixa abaixo.'
                    : 'O seu comprovativo de agendamento foi gerado com sucesso. O pagamento presencial refere-se exclusivamente ao serviço de apoio na realização da inscrição da candidatura.'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSummary((prev) => !prev)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {showSummary ? 'Ocultar resumo' : 'Mostrar resumo'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="rounded-full border border-[#FF6D00] bg-[#FF6D00] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E06000] transition flex items-center gap-2"
                >
                  <FileDown className="w-3.5 h-3.5 text-white" />
                  Baixar comprovativo
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition"
                >
                  Voltar
                </button>
              </div>

              {showSummary && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Nome do Candidato</span>
                    <span className="font-normal text-slate-855 text-xs sm:text-sm truncate block">{agendamento.nomeCompleto}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Nº de Candidatura</span>
                    <span className="font-normal text-[#FF6D00] text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 bg-[#FF6D00] rounded-full animate-pulse"></span>
                      Nº {String(agendamento.numeroOrdem).padStart(3, '0')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Província de Naturalidade</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.provinciaNaturalidade}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Província de Candidatura</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.provinciaCandidatura}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Órgão</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.orgao}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Idade</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.idade} anos</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Gênero</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.genero}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Altura</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.altura.toFixed(2)} m</span>
                  </div>
                </div>
              )}
            </div>

            {isMulticaixa ? (
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
            ) : (
              <div className="bg-slate-50 rounded-2xl p-5 md:p-6 shadow-md border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Pagamento Presencial</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O seu comprovativo de agendamento presencial foi gerado com sucesso. O pagamento efetuado refere-se exclusivamente ao serviço de apoio na realização da inscrição da candidatura.
                </p>
              </div>
            )}

            {!isPresencial && (
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
              </div>
            )}

            {!isPresencial ? (
              <div className="flex gap-3 bg-white border border-orange-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
                <AlertCircle className="w-5 h-5 text-[#FF6D00] shrink-0 mt-0.5" />
                <div>{instructionsContent}</div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-5 md:p-6 shadow-md border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Pagamento Presencial</h3>
                {instructionsContent}
              </div>
            )}

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
