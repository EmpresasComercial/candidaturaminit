import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DollarSign, ArrowRight, Phone } from 'lucide-react';
import { Agendamento, PROVINCIAS_ANGOLA } from '../types';

export default function ScheduleStep() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [provinciaNaturalidade, setProvinciaNaturalidade] = useState('');
  const [provinciaCandidatura, setProvinciaCandidatura] = useState('');
  const [orgao, setOrgao] = useState('');
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('');
  const [altura, setAltura] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [modalidadePagamento, setModalidadePagamento] = useState<'multicaixa' | 'presencial' | ''>('');
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
  const [alturaError, setAlturaError] = useState('');
  const [showAlturaModal, setShowAlturaModal] = useState(false);

  const ORGAO_OPTIONS = [
    'Órgão Polícia Nacional',
    'Órgão Investigação Criminal',
    'Órgão Migração e Estrangeiros',
    'Órgão Serviço Penitenciário',
    'Órgão Proteção Civil e Bombeiros',
  ];

  const idadeOptions = Array.from({ length: 18 }, (_, index) => index + 18);
  const alturaOptions = Array.from({ length: 101 }, (_, index) => (1 + index * 0.01).toFixed(2));

  const getAlturaMin = (currentGenero: string, currentOrgao: string) => {
    if (currentOrgao === 'Órgão Serviço Penitenciário') {
      return currentGenero === 'Masculino' ? 1.7 : currentGenero === 'Feminino' ? 1.6 : 0;
    }
    return currentGenero === 'Masculino' ? 1.65 : currentGenero === 'Feminino' ? 1.6 : 0;
  };

  const alturaMin = getAlturaMin(genero, orgao);

  const validateAltura = (value: string, currentGenero: string, currentOrgao: string) => {
    if (!currentGenero || !currentOrgao) {
      setAlturaError('Selecione o gênero e o órgão antes de escolher a altura.');
      return;
    }

    const numeric = parseFloat(value);
    if (!value || isNaN(numeric)) {
      setAlturaError('Selecione uma altura válida em metros.');
      return;
    }

    const min = getAlturaMin(currentGenero, currentOrgao);
    if (numeric < min) {
      setAlturaError(`Altura mínima para ${currentGenero} no ${currentOrgao} é ${min.toFixed(2)} m.`);
      return;
    }

    setAlturaError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setError('Por favor, introduza o Nome completo.');
      return;
    }
    if (!provinciaNaturalidade.trim()) {
      setError('Por favor, introduza a Província de Naturalidade.');
      return;
    }
    if (!provinciaCandidatura.trim()) {
      setError('Por favor, introduza a Província de Candidatura.');
      return;
    }
    if (!orgao) {
      setError('Por favor, selecione o Órgão de Candidatura.');
      return;
    }
    if (!idade) {
      setError('Por favor, selecione a Idade.');
      return;
    }
    if (Number(idade) < 18) {
      setError('A idade mínima para se candidatar é 18 anos.');
      return;
    }
    if (!genero) {
      setError('Por favor, selecione o Gênero.');
      return;
    }
    if (!modalidadePagamento) {
      setError('Por favor, selecione a modalidade de pagamento.');
      return;
    }
    if (!telefone.trim()) {
      setError('Por favor, introduza o seu contacto telefónico.');
      return;
    }
    if (!email.trim()) {
      setError('Por favor, introduza o seu endereço de e-mail.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Por favor, introduza um endereço de e-mail válido.');
      return;
    }
    if (!altura.trim()) {
      setError('Por favor, selecione a Altura.');
      return;
    }

    const alturaNum = parseFloat(altura);
    if (isNaN(alturaNum) || alturaNum < alturaMin) {
      setError(`Altura mínima para ${genero} no ${orgao} é ${alturaMin.toFixed(2)} m.`);
      return;
    }

    setError('');

    const formattedRef = '928 809 034';
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
    const numeroFatura = `FT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(nextOrderNumber).padStart(4, '0')}`;

    const novoAgendamento: Agendamento = {
      id: randomId,
      nomeCompleto: nome,
      telefone: telefone.trim(),
      email: email.trim(),
      provinciaNaturalidade: provinciaNaturalidade.trim(),
      provinciaCandidatura: provinciaCandidatura.trim(),
      orgao,
      idade: Number(idade),
      genero,
      altura: alturaNum,
      modalidadePagamento,
      comentario: comentario.trim(),
      valor: 1000,
      dataCriacao: new Date().toISOString(),
      referenciaMulticaixa: modalidadePagamento === 'multicaixa' ? formattedRef : '',
      entidadeMulticaixa: modalidadePagamento === 'multicaixa' ? '21012' : '',
      pago: false,
      numeroOrdem: nextOrderNumber,
      numeroFatura,
    };

    existingBookings.push(novoAgendamento);
    localStorage.setItem('concurso_agendamentos', JSON.stringify(existingBookings));

    navigate('/pagamento', { state: { agendamento: novoAgendamento } });
  };

  return (
    <div>
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/40 p-6 md:p-8">
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-3.5 rounded-xl text-xs font-normal mb-5">
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

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block" htmlFor="input-telefone">
                Contacto Telefónico
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
                  placeholder="Insira o seu número de telefone"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all text-sm text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block" htmlFor="input-email">
                E-mail
              </label>
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Insira o seu endereço de e-mail"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-provincia-naturalidade">
                  Província de Naturalidade
                </label>
                <input
                  id="input-provincia-naturalidade"
                  list="provincias-options"
                  value={provinciaNaturalidade}
                  onChange={(e) => setProvinciaNaturalidade(e.target.value)}
                  placeholder="Digite ou selecione a província"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00]"
                  required
                />
                <datalist id="provincias-options">
                  {PROVINCIAS_ANGOLA.map((prov) => (
                    <option key={prov} value={prov} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-provincia-candidatura">
                  Província de Candidatura
                </label>
                <input
                  id="input-provincia-candidatura"
                  list="provincias-options"
                  value={provinciaCandidatura}
                  onChange={(e) => setProvinciaCandidatura(e.target.value)}
                  placeholder="Digite ou selecione a província"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="select-idade">
                  Idade
                </label>
                <select
                  id="select-idade"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00]"
                  required
                >
                  <option value="" disabled>Selecione a idade</option>
                  {idadeOptions.map((option) => (
                    <option key={option} value={option}>{option} anos</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="select-orgao">
                  Órgão
                </label>
                <select
                  id="select-orgao"
                  value={orgao}
                  onChange={(e) => {
                    setOrgao(e.target.value);
                    if (altura) {
                      validateAltura(altura, genero, e.target.value);
                    }
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00]"
                  required
                >
                  <option value="" disabled>Selecione o órgão de candidatura</option>
                  {ORGAO_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block">
                  Gênero
                </label>
                <div className="flex items-center gap-4">
                  {['Masculino', 'Feminino'].map((option) => (
                    <label key={option} className="inline-flex items-center gap-2 text-sm text-slate-900">
                      <input
                        type="radio"
                        name="genero"
                        value={option}
                        checked={genero === option}
                        onChange={(e) => {
                          setGenero(e.target.value);
                          if (altura) {
                            validateAltura(altura, e.target.value, orgao);
                          }
                        }}
                        className="h-4 w-4 text-[#FF6D00] accent-[#FF6D00]"
                        required
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-normal text-slate-600 block" htmlFor="input-altura">
                Altura (metros)
              </label>
              <button
                type="button"
                id="input-altura"
                onClick={() => {
                  setShowAlturaModal(true);
                  setError('');
                }}
                className="w-full text-left rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00]"
              >
                {altura ? `${parseFloat(altura).toFixed(2)} m` : 'Clique para selecionar a altura'}
              </button>
              {alturaError && (
                <p className="text-xs text-rose-600">{alturaError}</p>
              )}

              {showAlturaModal && (
                <div className="absolute z-20 left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl p-3">
                  {!genero || !orgao ? (
                    <div className="text-sm text-slate-500">
                      Selecione primeiro o gênero e o órgão para ver as alturas disponíveis.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {alturaOptions
                        .filter((value) => parseFloat(value) >= alturaMin)
                        .map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setAltura(value);
                              validateAltura(value, genero, orgao);
                              setShowAlturaModal(false);
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700 hover:bg-[#FF6D00] hover:text-white transition"
                          >
                            {value} m
                          </button>
                        ))}
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAlturaModal(false)}
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block">
                Modalidade de Pagamento
              </label>
              <div className="flex flex-col gap-3">
                <label className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 cursor-pointer">
                  <input
                    type="radio"
                    name="modalidadePagamento"
                    value="multicaixa"
                    checked={modalidadePagamento === 'multicaixa'}
                    onChange={(e) => setModalidadePagamento(e.target.value as 'multicaixa' | 'presencial')}
                    className="h-4 w-4 text-[#FF6D00] accent-[#FF6D00]"
                    required
                  />
                  Pagamento Multicaixa Express (online)
                </label>
                <label className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 cursor-pointer">
                  <input
                    type="radio"
                    name="modalidadePagamento"
                    value="presencial"
                    checked={modalidadePagamento === 'presencial'}
                    onChange={(e) => setModalidadePagamento(e.target.value as 'multicaixa' | 'presencial')}
                    className="h-4 w-4 text-[#FF6D00] accent-[#FF6D00]"
                    required
                  />
                  Pagamento Presencial (no local)
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block" htmlFor="textarea-comentario">
                Comentário (opcional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </span>
                <input
                  type="text"
                  value="1.000,00 Kz (MIL KWANZAS)"
                  readOnly
                  id="input-valor"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-[#FF6D00] font-bold text-base md:text-lg cursor-not-allowed outline-hidden"
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                id="btn-agendar"
                className="w-full flex items-center justify-center gap-2 bg-[#FF6D00] hover:bg-[#E06000] text-white font-semibold font-display h-[54px] rounded-full shadow-md shadow-orange-500/10 transition-all duration-300 active:scale-95 cursor-pointer text-sm"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 font-semibold font-display h-[54px] rounded-full shadow-sm shadow-slate-200 transition-all duration-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
