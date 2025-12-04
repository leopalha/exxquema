import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, DollarSign, Music, Users, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const EventCard = ({ event, isToday = false, isExpanded = false }) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const cardVariants = {
    collapsed: { height: 'auto' },
    expanded: { height: 'auto' }
  };

  const contentVariants = {
    collapsed: { opacity: 0, height: 0 },
    expanded: { opacity: 1, height: 'auto' }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3)' }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 transition-all"
      style={{
        borderColor: isToday ? 'var(--theme-primary)' : 'rgb(55, 65, 81)',
        boxShadow: isToday ? 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.5) 0 0 20px' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isToday) {
          e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isToday) {
          e.currentTarget.style.borderColor = 'rgb(55, 65, 81)';
        }
      }}
    >
      {/* Header do Card */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Badge HOJE */}
        {isToday && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-2 text-white text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            <Sparkles className="w-3 h-3" />
            HOJE
          </motion.div>
        )}

        {/* Título e Emoji */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--theme-primary)' }}>
              {event.dia}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{event.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{event.titulo}</h2>
                <p className="text-gray-400 text-sm mt-1">{event.subtitulo}</p>
              </div>
            </div>
          </div>

          {/* Ícone Expandir */}
          <button
            className="text-gray-400 transition-colors p-2"
            style={expanded ? { color: 'var(--theme-primary)' } : {}}
            onMouseEnter={(e) => e.target.style.color = 'var(--theme-primary)'}
            onMouseLeave={(e) => e.target.style.color = expanded ? 'var(--theme-primary)' : 'rgb(156, 163, 175)'}
            aria-label={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>

        {/* Descrição Curta */}
        <p className="text-gray-300 text-sm leading-relaxed">
          {event.descricaoCurta}
        </p>

        {/* Preview de Horários (Sempre visível) */}
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <Clock className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
          <span>
            {event.horarios[0]?.inicio} - {event.horarios[event.horarios.length - 1]?.fim}
          </span>
        </div>
      </div>

      {/* Conteúdo Expansível */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6 border-t-2 border-gray-700"
          >
            <div className="pt-6 space-y-6">
              {/* Descrição Completa */}
              <div>
                <p className="text-gray-300 leading-relaxed">{event.descricaoCompleta}</p>
              </div>

              {/* Horários Detalhados */}
              <div>
                <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                  <Clock className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  Horários
                </h4>
                <div className="space-y-3">
                  {event.horarios.map((horario, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-gray-700"
                    >
                      <div className="flex-shrink-0 font-mono text-sm font-semibold" style={{ color: 'var(--theme-primary)' }}>
                        {horario.inicio}-{horario.fim}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{horario.atividade}</div>
                        <div className="text-gray-400 text-xs mt-1">{horario.descricao}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promoções */}
              <div>
                <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                  <DollarSign className="w-5 h-5" style={{ color: 'var(--theme-secondary)' }} />
                  Promoções
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {event.promocoes.map((promo, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border"
                      style={{
                        background: 'linear-gradient(135deg, rgba(var(--theme-primary-rgb, 255, 0, 110), 0.1), rgba(var(--theme-secondary-rgb, 0, 212, 255), 0.05))',
                        borderColor: 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{promo.icone}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm">{promo.titulo}</div>
                          {promo.preco && (
                            <div className="font-bold text-lg" style={{ color: 'var(--theme-primary)' }}>{promo.preco}</div>
                          )}
                          {promo.desconto && (
                            <div className="font-bold text-lg" style={{ color: 'var(--theme-primary)' }}>{promo.desconto}</div>
                          )}
                          <div className="text-gray-400 text-xs mt-1">{promo.descricao}</div>
                          {promo.validade && (
                            <div className="text-gray-500 text-xs mt-1">Válido {promo.validade}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line-up do Mês */}
              {event.lineup && (
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                    <Music className="w-5 h-5" style={{ color: 'var(--theme-secondary)' }} />
                    Line-up do Mês
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.lineup.map((show, index) => (
                      <div
                        key={index}
                        className="p-3 bg-black/30 rounded-lg border border-gray-700 transition-colors"
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgb(55, 65, 81)'}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm" style={{ color: 'var(--theme-primary)' }}>{show.data}</span>
                          {show.bpm && (
                            <span className="text-xs text-gray-500 font-mono">{show.bpm} BPM</span>
                          )}
                        </div>
                        <div className="font-semibold text-white text-sm">{show.artista}</div>
                        <div className="text-gray-400 text-xs mt-1">{show.genero}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tema do Mês (apenas sábado) */}
              {event.temaMes && (
                <div className="p-4 rounded-lg border-2" style={{
                  background: 'linear-gradient(to right, rgba(var(--theme-primary-rgb, 255, 0, 110), 0.2), rgba(var(--theme-secondary-rgb, 0, 212, 255), 0.1))',
                  borderColor: 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.5)'
                }}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{event.temaMes.emoji}</span>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">
                        Tema do Mês: {event.temaMes.nome}
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• {event.temaMes.descricao}</li>
                        <li>• {event.temaMes.dressCode}</li>
                        <li>• <span className="font-semibold" style={{ color: 'var(--theme-primary)' }}>{event.temaMes.premio}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações Adicionais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 uppercase text-xs font-semibold mb-1">Público</div>
                  <div className="text-gray-300 flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: 'var(--theme-secondary)' }} />
                    {event.publico}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 uppercase text-xs font-semibold mb-1">Dress Code</div>
                  <div className="text-gray-300">{event.dressCode}</div>
                </div>
                <div>
                  <div className="text-gray-500 uppercase text-xs font-semibold mb-1">Estilo Musical</div>
                  <div className="text-gray-300">{event.musica.join(', ')}</div>
                </div>
                <div>
                  <div className="text-gray-500 uppercase text-xs font-semibold mb-1">Reserva</div>
                  <div className="text-gray-300">{event.reserva}</div>
                </div>
              </div>

              {/* Atenção (se existir) */}
              {event.atencao && (
                <div className="p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg">
                  <p className="text-red-400 font-semibold text-sm">{event.atencao}</p>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:scale-105 hover:opacity-90"
                  style={{
                    background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                    boxShadow: 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3) 0 0 20px'
                  }}
                >
                  Reservar Mesa
                </button>
                <button
                  className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 border-2"
                  style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--theme-primary)';
                  }}
                >
                  Adicionar à Agenda
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Borda inferior animada para "Hoje" */}
      {isToday && (
        <motion.div
          className="h-1"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear'
          }}
          style={{
            backgroundSize: '200% 100%',
            background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary), var(--theme-primary))'
          }}
        />
      )}
    </motion.div>
  );
};

export default EventCard;
