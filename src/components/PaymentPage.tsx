import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Copy, Smartphone, 
  AlertCircle, Send, FileDown, MessageSquare 
} from 'lucide-react';
import { Agendamento } from '../types';
import EmblemAngola from './EmblemAngola';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const agendamento = (location.state as { agendamento?: Agendamento })?.agendamento;

  const [copyMessage, setCopyMessage] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  if (!agendamento) {
    return <Navigate to="/" replace />;
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopyMessage(`${label} copiado com sucesso. Abra o seu aplicativo para fazer o pagamento do valor de 1.000,00 Kz.`);
    setTimeout(() => setCopyMessage(''), 3000);
  };

  const handleDownloadPDF = async () => {
    const module = await import('../lib/pdfGenerator');
    module.generateAppointmentPDF(agendamento);
  };

  const instructionsContent = (
    <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
      <p className="font-bold text-slate-800">INSTRUÇÕES:</p>
      <p>Pagamento Multicaixa Express gerado com sucesso.</p>
      <p className="font-semibold text-slate-800">Procedimento rápido:</p>
      <p className="font-semibold">1. Abra o Multicaixa Express</p>
      <p className="font-semibold">2. Insira a referência ou o número de entidade</p>
      <p className="font-semibold text-red-600">3. Pague <span className="text-red-600">1.000,00 KZ</span></p>
      <p className="font-semibold">4. Capture o talão de pagamento emitido</p>
      <p className="font-semibold">5. Envie o comprovativo para WhatsApp <span className="text-red-600">928 80 90 34</span></p>
      <p>Após confirmação, envie também:</p>
      <p className="font-semibold text-red-600">Bilhete de Identidade em PDF</p>
      <p className="font-semibold text-red-600">Certificado em PDF</p>
      <p className="font-semibold text-red-600">Inscrição no dia 16</p>
      <p>Obrigado por ter concluído o agendamento.</p>
    </div>
  );

  const getWhatsAppLink = () => {
    const pagamentoTexto = `🎫 *Referência:* ${agendamento.referenciaMulticaixa}`;

    const text = `Olá! Acabei de efetuar o agendamento da candidatura para o concurso público do Ministério do Interior no portal.%0A%0A*DADOS DE AGENDAMENTO:*%0A👤 *Nome:* ${encodeURIComponent(agendamento.nomeCompleto)}%0A👨‍👩‍👧 *Pai:* ${encodeURIComponent(agendamento.nomeCompletoPai)}%0A👩 *Mãe:* ${encodeURIComponent(agendamento.nomeCompletoMae)}%0A🎂 *Data de Nascimento:* ${encodeURIComponent(agendamento.dataNascimento)}%0A🪪 *Emissão do Bilhete:* ${encodeURIComponent(agendamento.dataEmissaoBilhete)}%0A📅 *Expiração do Bilhete:* ${encodeURIComponent(agendamento.dataExpiracaoBilhete)}%0A✉️ *E-mail:* ${encodeURIComponent(agendamento.email || '-') }%0A📍 *Província de Naturalidade:* ${encodeURIComponent(agendamento.provinciaNaturalidade)}%0A🏢 *Órgão:* ${encodeURIComponent(agendamento.orgao)}%0A💵 *Valor:* 1.000 Kz%0A%0A*DADOS DE PAGAMENTO:*%0A${encodeURIComponent(pagamentoTexto)}%0A%0AEnvio em anexo o comprovativo de pagamento para validação do agendamento e início da minha candidatura.`;
    return `https://wa.me/244928809034?text=${text}`;
  };

  return (
    <div>
      <div className="relative max-w-2xl mx-auto px-4 py-8">
        {copyMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <div className="max-w-xl w-full rounded-2xl bg-white/95 border border-slate-300 p-5 shadow-xl shadow-slate-900/10 text-center backdrop-blur-sm">
              <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-[#FF6D00]/10 flex items-center justify-center text-[#FF6D00]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-900 font-semibold">{copyMessage}</p>
            </div>
          </div>
        )}
        <div className="space-y-6">
          <div id="printable-receipt" className="hidden print:block bg-white p-8 text-black font-mono">
            <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
              <h1 className="text-lg font-bold text-[#FF6D00] uppercase">TALÃO DE AGENDAMENTO DE CANDIDATURA</h1>
              <p className="text-xs font-bold">MINISTÉRIO DO INTERIOR - REPÚBLICA DE ANGOLA</p>
              <p className="text-[10px] text-slate-500">Agendamento ID: {agendamento.id.toUpperCase()}</p>
            </div>
            
            <div className="space-y-2 text-xs border-b border-slate-200 pb-4 mb-4">
              <p><span className="text-slate-500 font-normal">Candidato:</span> {agendamento.nomeCompleto}</p>
              <p><span className="text-slate-500 font-normal">Nome do Pai:</span> {agendamento.nomeCompletoPai}</p>
              <p><span className="text-slate-500 font-normal">Nome da Mãe:</span> {agendamento.nomeCompletoMae}</p>
              <p><span className="text-slate-500 font-normal">Data de Nascimento:</span> {agendamento.dataNascimento}</p>
              <p><span className="text-slate-500 font-normal">Data de Emissão do Bilhete:</span> {agendamento.dataEmissaoBilhete}</p>
              <p><span className="text-slate-500 font-normal">Data de Expiração do Bilhete:</span> {agendamento.dataExpiracaoBilhete}</p>
              <p><span className="text-slate-500 font-normal">E-mail:</span> {agendamento.email || '-'}</p>
              <p><span className="text-slate-500 font-normal">Nº de Candidatura:</span> {String(agendamento.numeroOrdem).padStart(3, '0')}</p>
              <p><span className="text-slate-500 font-normal">Nº de Fatura:</span> {agendamento.numeroFatura || '-'}</p>
              <p><span className="text-slate-500 font-normal">Província de Naturalidade:</span> {agendamento.provinciaNaturalidade}</p>
              <p><span className="text-slate-500 font-normal">Órgão:</span> {agendamento.orgao}</p>
              {agendamento.comentario && (
                <p><span className="text-slate-500 font-normal">Comentário:</span> {agendamento.comentario}</p>
              )}
              <p><span className="text-slate-500 font-normal">Data de Emissão:</span> {new Date().toLocaleDateString('pt-AO')}</p>
              <p><span className="text-slate-500 font-normal">Valor do Serviço:</span> 1.000 Kz</p>
            </div>

            <div className="my-4 p-4 border border-slate-300 bg-slate-50 text-xs rounded-lg">
              <p className="font-bold text-center text-slate-800 mb-2">DADOS PARA PAGAMENTO MULTICAIXA</p>
              <div className="space-y-1.5">
                <p><span className="text-slate-500 font-normal">Referência:</span> {agendamento.referenciaMulticaixa}</p>
                <p><span className="text-slate-500 font-normal">Valor:</span> 1.000 Kz</p>
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

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/40 p-6 md:p-8 space-y-6 print:hidden">
            <div className="text-center pb-4 border-b border-slate-100">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#FF6D00] font-display">
                Detalhes
              </h2>
              <p className="text-xs text-slate-400">
                O seu comprovativo de agendamento foi gerado com sucesso. Para concluir o processo, efetue o pagamento mediante a referência Multicaixa abaixo.
              </p>
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
                  className="rounded-full border border-[#FF6D00] bg-[#FF6D00] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E06000] transition duration-300 ease-out transform hover:-translate-y-0.5 hover:scale-105 shadow-[0_16px_40px_rgba(255,109,0,0.18)] animate-pulse flex items-center gap-2"
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
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">E-mail</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.email || '-'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Nº de Fatura</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.numeroFatura || '-'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Província de Naturalidade</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.provinciaNaturalidade}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Nome do Pai</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.nomeCompletoPai}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Nome da Mãe</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.nomeCompletoMae}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Data de Nascimento</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.dataNascimento}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Emissão do Bilhete</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.dataEmissaoBilhete}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Expiração do Bilhete</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.dataExpiracaoBilhete}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Gênero</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.genero}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-0.5">Órgão</span>
                    <span className="font-normal text-slate-800 text-xs sm:text-sm">{agendamento.orgao}</span>
                  </div>

                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-slate-200 text-slate-900">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-700">Número do Multicaixa Express: <span className="font-semibold text-[#FF6D00]">928 809 034</span></p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('928 809 034', 'Número do Multicaixa Express')}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 transition"
                    title="Copiar número"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-700">Valor a Pagar: <span className="font-semibold text-[#FF6D00]">1.000,00 Kz</span></p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('1.000,00 Kz', 'Valor a pagar')}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 transition"
                    title="Copiar valor"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 bg-white border border-orange-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
              <AlertCircle className="w-5 h-5 text-[#FF6D00] shrink-0 mt-0.5" />
              <div>{instructionsContent}</div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => navigate('/')}
                className="text-xs text-slate-400 hover:text-slate-600 underline font-normal cursor-pointer"
              >
                Fazer novo agendamento
              </button>
            </div>

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
