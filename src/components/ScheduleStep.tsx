import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DollarSign, ArrowRight } from 'lucide-react';
import { Agendamento, PROVINCIAS_ANGOLA } from '../types';

export default function ScheduleStep() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [nomeCompletoPai, setNomeCompletoPai] = useState('');
  const [nomeCompletoMae, setNomeCompletoMae] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [dataEmissaoBilhete, setDataEmissaoBilhete] = useState('');
  const [dataExpiracaoBilhete, setDataExpiracaoBilhete] = useState('');
  const [provinciaNaturalidade, setProvinciaNaturalidade] = useState('');
  const [orgao, setOrgao] = useState('');
  const [genero, setGenero] = useState('');
  const [email, setEmail] = useState('');
  const [modalidadePagamento, setModalidadePagamento] = useState<'multicaixa' | ''>('multicaixa');
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');

  const ORGAO_OPTIONS = [
    'Órgão Polícia Nacional',
    'Órgão Investigação Criminal',
    'Órgão Migração e Estrangeiros',
    'Órgão Serviço Penitenciário',
    'Órgão Proteção Civil e Bombeiros',
  ];


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
    if (!orgao) {
      setError('Por favor, selecione o Órgão de Candidatura.');
      return;
    }
    if (!genero) {
      setError('Por favor, selecione o Gênero.');
      return;
    }
    if (!dataNascimento.trim()) {
      setError('Por favor, introduza a Data de Nascimento.');
      return;
    }
    if (!dataEmissaoBilhete.trim()) {
      setError('Por favor, introduza a Data de Emissão do Bilhete.');
      return;
    }
    if (!dataExpiracaoBilhete.trim()) {
      setError('Por favor, introduza a Data de Expiração do Bilhete.');
      return;
    }
    if (!modalidadePagamento) {
      setError('Por favor, selecione a modalidade de pagamento.');
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
      nomeCompletoPai: nomeCompletoPai.trim(),
      nomeCompletoMae: nomeCompletoMae.trim(),
      dataNascimento: dataNascimento.trim(),
      dataEmissaoBilhete: dataEmissaoBilhete.trim(),
      dataExpiracaoBilhete: dataExpiracaoBilhete.trim(),
      email: email.trim(),
      provinciaNaturalidade: provinciaNaturalidade.trim(),
      orgao,
      genero,
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

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-nome-pai">
                  Nome Completo do Pai
                </label>
                <input
                  id="input-nome-pai"
                  type="text"
                  value={nomeCompletoPai}
                  onChange={(e) => setNomeCompletoPai(e.target.value)}
                  placeholder="Insira o nome completo do pai"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-nome-mae">
                  Nome Completo da Mãe
                </label>
                <input
                  id="input-nome-mae"
                  type="text"
                  value={nomeCompletoMae}
                  onChange={(e) => setNomeCompletoMae(e.target.value)}
                  placeholder="Insira o nome completo da mãe"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-data-nascimento">
                  Data de Nascimento
                </label>
                <input
                  id="input-data-nascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-data-emissao-bilhete">
                  Data de Emissão do Bilhete
                </label>
                <input
                  id="input-data-emissao-bilhete"
                  type="date"
                  value={dataEmissaoBilhete}
                  onChange={(e) => setDataEmissaoBilhete(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-data-expiracao-bilhete">
                  Data de Expiração do Bilhete
                </label>
                <input
                  id="input-data-expiracao-bilhete"
                  type="date"
                  value={dataExpiracaoBilhete}
                  onChange={(e) => setDataExpiracaoBilhete(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00] focus:bg-white transition-all"
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

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="input-provincia-naturalidade">
                  Província de Naturalidade (21 províncias oficiais)
                </label>
                <input
                  id="input-provincia-naturalidade"
                  list="provincias-options"
                  value={provinciaNaturalidade}
                  onChange={(e) => setProvinciaNaturalidade(e.target.value)}
                  placeholder="Digite ou selecione uma das 21 províncias oficiais"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-[#FF6D00]/10 focus:border-[#FF6D00]"
                  required
                />
                <datalist id="provincias-options">
                  {PROVINCIAS_ANGOLA.map((prov) => (
                    <option key={prov} value={prov} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-slate-600 block" htmlFor="select-orgao">
                  Órgão
                </label>
                <select
                  id="select-orgao"
                  value={orgao}
                  onChange={(e) => setOrgao(e.target.value)}
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
                        onChange={(e) => setGenero(e.target.value)}
                        className="h-4 w-4 text-[#FF6D00] accent-[#FF6D00]"
                        required
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
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
                    onChange={(e) => setModalidadePagamento('multicaixa')}
                    className="h-4 w-4 text-[#FF6D00] accent-[#FF6D00]"
                    required
                  />
                  Pagamento Multicaixa Express (online)
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
