import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, MapPin, Phone, DollarSign, ArrowLeft, ArrowRight } from 'lucide-react';
import { Agendamento, PROVINCIAS_ANGOLA } from '../types';
import EmblemAngola from './EmblemAngola';

export default function ScheduleStep() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Por favor, introduza o seu Nome Completo.');
      return;
    }
    if (!cidade.trim()) {
      setError('Por favor, introduza a sua Cidade.');
      return;
    }
    if (!telefone.trim()) {
      setError('Por favor, introduza o seu Número de Telefone.');
      return;
    }
    
    const cleanPhone = telefone.replace(/\s+/g, '');
    if (cleanPhone.length < 9) {
      setError('O número de telefone deve conter no mínimo 9 dígitos.');
      return;
    }

    setError('');

    const formattedRef = "928 809 034";
    const randomId = `AG-${Math.floor(1000 + Math.random() * 9000)}`;

    const savedBookingsJSON = localStorage.getItem('concurso_agendamentos');
    let existingBookings: Agendamento[] = [];
    if (savedBookingsJSON) {
      try {
        existingBookings = JSON.parse(savedBookingsJSON);
      } catch {
        existingBookings = [];
      }
    }

    const nextOrderNumber = existingBookings.length + 1;

    const novoAgendamento: Agendamento = {
      id: randomId,
      nomeCompleto: nome,
      cidade,
      telefone,
      valor: 1250,
      dataCriacao: new Date().toISOString(),
      referenciaMulticaixa: formattedRef,
      entidadeMulticaixa: '21012',
      pago: false,
      numeroOrdem: nextOrderNumber
    };

    existingBookings.push(novoAgendamento);
    localStorage.setItem('concurso_agendamentos', JSON.stringify(existingBookings));

    navigate('/pagamento', { state: { agendamento: novoAgendamento } });
  };

  const suggestions = PROVINCIAS_ANGOLA.filter(prov => 
    prov.toLowerCase().includes(cidade.toLowerCase()) && 
    cidade.trim() !== '' && 
    prov.toLowerCase() !== cidade.toLowerCase()
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#FF6D00] transition-colors mb-6 font-normal group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Voltar para a página inicial</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/40 p-6 md:p-8 space-y-6"
        >
          <div className="flex flex-col items-center text-center space-y-3 pb-2 border-b border-slate-100">
            <EmblemAngola className="w-16 h-16" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Formulário de Agendamento
              </h2>
              <p className="text-xs text-slate-400">
                Preencha os seus dados para gerar o seu talão de agendamento de suporte técnico.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-3.5 rounded-xl text-xs font-normal">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="form-agendamento">
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block" htmlFor="input-nome">
                Nome Completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="input-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Insira o seu nome completo"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all text-sm text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-normal text-slate-600 block" htmlFor="input-cidade">
                Cidade / Província
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <input
                  id="input-cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => {
                    setCidade(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Ex: Luanda, Benguela, Lubango..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all text-sm text-slate-900"
                  required
                />
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-slate-100 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto divide-y divide-slate-50">
                  {suggestions.map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => {
                        setCidade(prov);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block" htmlFor="input-telefone">
                Número de Telefone
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  id="input-telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Coloque o seu contacto telefónico"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all text-sm font-mono text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-500 block">
                Valor do Serviço de Apoio (Somente Leitura)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </span>
                <input
                  type="text"
                  value="1.250 Kz"
                  readOnly
                  id="input-valor"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-normal text-sm cursor-not-allowed outline-hidden"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                id="btn-gerar-talao"
                className="w-full flex items-center justify-center gap-2 bg-[#FF6D00] hover:bg-[#E06000] text-white font-semibold font-display h-[54px] rounded-full shadow-md shadow-orange-500/10 transition-all duration-300 active:scale-95 cursor-pointer text-sm"
              >
                <span>Gerar Talão de Agendamento</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
