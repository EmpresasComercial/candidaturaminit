import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CalendarRange, ArrowRight } from 'lucide-react';
import EmblemAngola from './EmblemAngola';

export default function HomeStep() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center min-h-[75vh] bg-white text-slate-900 px-4 md:px-8 py-16">
        <div className="max-w-4xl text-center space-y-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-2"
          >
            <EmblemAngola className="w-32 h-32 md:w-36 md:h-36" />
          </motion.div>

          <div className="space-y-4 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-[#FF6D00] leading-tight"
              id="main-portal-title"
            >
              «Agendar candidatura da minha inscrição para o concurso público do Ministério do Interior»
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-slate-500 max-w-xl mx-auto font-normal"
            >
              Atendimento exclusivo para o serviço presencial de assessoria e preenchimento da candidatura digital de forma segura e guiada.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4"
          >
            <button
              onClick={() => navigate('/agendar')}
              id="btn-agendar-agora"
              className="group relative flex items-center justify-center gap-3 bg-[#FF6D00] hover:bg-[#E06000] text-white font-bold font-display px-12 py-4 rounded-full shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 active:scale-95 cursor-pointer text-base md:text-lg min-w-[240px] h-[54px]"
            >
              <span>Agendar Agora</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl text-left text-sm text-slate-500 space-y-4 mx-auto"
          >
            <div>
              <p className="font-semibold text-slate-900">Objetivo do Portal:</p>
              <p>
                O portal oferece apoio presencial para o agendamento do serviço de assessoria à candidatura do concurso público do Ministério do Interior.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Informações do Serviço:</p>
              <p>
                O valor cobrado refere-se exclusivamente ao serviço de assistência na realização da inscrição. A candidatura será feita no portal oficial do Ministério do Interior, dentro das regras instituídas, e o pagamento não garante vaga, aprovação ou qualquer benefício no concurso.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-2 text-xs text-slate-400 justify-center"
          >
            <CalendarRange className="w-4 h-4 text-[#FF6D00]" />
            <span>Atendimento agendado e organizado por ordem de chegada</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
