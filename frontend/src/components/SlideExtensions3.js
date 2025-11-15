import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, BarChart3, Clock, Target, Settings, AlertCircle, CheckCircle, Share2, Globe, Calendar } from 'lucide-react';

// Parte 3: Slides de estrutura (papéis, sociedade, decisões, timeline)
export const renderStructureSlides = (slide, textSize, getTextSize, fadeIn) => {

  // SLIDE: ROLES 4 PARTNERS (PAPÉIS 4 SÓCIOS)
  if (slide.type === 'roles-4partners') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* 4 Quadrantes dos Sócios */}
            <div className="grid grid-cols-2 gap-6">
              {slide.partners.map((partner, idx) => {
                const colors = [
                  { border: 'border-amber-500', bg: 'from-amber-900/30', text: 'text-amber-400' },
                  { border: 'border-blue-500', bg: 'from-blue-900/30', text: 'text-blue-400' },
                  { border: 'border-purple-500', bg: 'from-purple-900/30', text: 'text-purple-400' },
                  { border: 'border-green-500', bg: 'from-green-900/30', text: 'text-green-400' }
                ];
                const color = colors[idx];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className={`bg-gradient-to-br ${color.bg} to-transparent border-2 ${color.border} rounded-xl p-6`}
                  >
                    <div className="text-center mb-4">
                      <h3 className={`text-2xl font-black ${color.text} mb-1`}>{partner.name} ({partner.percent})</h3>
                      <p className={`${getTextSize('sm')} text-gray-400`}>{partner.role}</p>
                      <p className="text-xl font-bold text-white mt-2">💰 {partner.proLabore || `PRÓ-LABORE: ${partner.percent}`}</p>
                      <p className={`${getTextSize('sm')} text-gray-400 flex items-center justify-center gap-2 mt-1`}>
                        <Clock className="w-4 h-4" />
                        {partner.dedicacao}
                      </p>
                    </div>
                    <div className={`${getTextSize('base')} text-gray-300 space-y-2`}>
                      {partner.tasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                          <p>{task}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Decisões em Conjunto */}
            {slide.juntos && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-red-900/30 to-transparent border-2 border-red-500 rounded-xl p-6 text-center"
              >
                <h3 className="text-2xl font-bold text-red-400 mb-4">{slide.juntos.title}</h3>
                <div className={`${getTextSize('lg')} text-gray-300 grid grid-cols-3 gap-4`}>
                  {slide.juntos.items.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: SOCIETY (SOCIEDADE)
  if (slide.type === 'society') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Participação */}
            {slide.participacao && slide.participacao.socios && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-amber-900/30 to-transparent border-2 border-amber-500 rounded-xl p-8"
              >
                <h3 className="text-3xl font-bold text-amber-400 mb-6 text-center">{slide.participacao.title}</h3>
                <div className="grid grid-cols-4 gap-6">
                  {slide.participacao.socios.map((socio, i) => (
                    <div key={i} className="text-center">
                      <p className={`${getTextSize('lg')} text-gray-300 mb-2`}>{socio.nome}</p>
                      <p className="text-4xl font-bold text-white">{socio.percent}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pró-Labore */}
            {slide.proLabore && slide.proLabore.items && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-green-900/30 to-transparent border-2 border-green-500 rounded-xl p-8"
              >
                <h3 className="text-3xl font-bold text-green-400 mb-6 text-center">{slide.proLabore.title}</h3>
                <div className="grid grid-cols-4 gap-6 mb-6">
                  {slide.proLabore.items.map((item, i) => (
                  <div key={i} className="text-center">
                    <p className={`${getTextSize('base')} text-gray-400 mb-2`}>{item.socio}</p>
                    <p className="text-3xl font-bold text-white">{item.valor}</p>
                  </div>
                ))}
              </div>
              <p className={`${getTextSize('lg')} text-gray-300 text-center`}>{slide.proLabore.total}</p>
            </motion.div>
            )}

            {/* Lucro */}
            {slide.lucro && slide.lucro.items && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-blue-900/30 to-transparent border-2 border-blue-500 rounded-xl p-8"
              >
                <h3 className="text-3xl font-bold text-blue-400 mb-6 text-center">{slide.lucro.title}</h3>
                <div className={`${getTextSize('lg')} text-gray-300 text-center space-y-3`}>
                  {slide.lucro.items.map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: DECISIONS TABLE (TABELA DE DECISÕES)
  if (slide.type === 'decisions-table') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            {slide.categories && slide.categories.map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`bg-gradient-to-r ${
                  category.highlight
                    ? 'from-red-900/30 to-transparent border-2 border-red-500'
                    : 'from-gray-900 to-transparent border border-gray-700'
                } rounded-xl p-6`}
              >
                <h3 className={`text-2xl font-bold mb-4 ${category.highlight ? 'text-red-400' : 'text-gray-300'}`}>
                  {category.tipo}
                </h3>
                <div className={`${getTextSize('lg')} text-gray-300 space-y-2`}>
                  {category.items && category.items.map((item, j) => (
                    <p key={j}>• {item}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: PROJECT TIMELINE
  if (slide.type === 'project-timeline') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            {slide.phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className={`bg-gradient-to-r ${
                  phase.highlight
                    ? 'from-green-900/30 to-transparent border-2 border-green-500'
                    : 'from-gray-900 to-transparent border border-gray-700'
                } rounded-xl p-6`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className={`w-8 h-8 ${phase.highlight ? 'text-green-400' : 'text-gray-400'}`} />
                  <div>
                    <h3 className={`text-2xl font-bold ${phase.highlight ? 'text-green-400' : 'text-gray-300'}`}>
                      {phase.fase}
                    </h3>
                    <p className={`${getTextSize('base')} text-gray-400`}>{phase.prazo}</p>
                  </div>
                </div>
                <div className={`${getTextSize('lg')} text-gray-300 space-y-2`}>
                  {phase.tasks.map((task, j) => (
                    <p key={j}>• {task}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
