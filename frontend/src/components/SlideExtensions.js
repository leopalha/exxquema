import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Minus, Calendar, Percent, Settings, Target, Users, Wine, BarChart3, Smartphone } from 'lucide-react';

// Extensões de tipos de slides adicionais
export const renderExtendedSlides = (slide, textSize, getTextSize, fadeIn) => {

  // SLIDE 9: RETORNO MENSAL
  if (slide.type === 'return') {
    const iconMap = {
      'dollar-sign': DollarSign,
      'building-2': TrendingUp,
      'gem': TrendingUp,
    };

    const scenarioIconMap = {
      'briefcase': TrendingUp,
      'trending-up': TrendingUp,
      'rocket': TrendingUp,
    };

    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="text-8xl font-black text-green-400 mb-8">{slide.mainValue}</div>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            {slide.breakdown.map((item, i) => {
              const IconComponent = iconMap[item.icon] || DollarSign;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center"
                >
                  <IconComponent className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <h3 className="text-3xl font-bold text-red-400 mb-3">{item.title}</h3>
                  <p className="text-4xl font-bold text-white mb-4">{item.value}</p>
                  <p className={`${getTextSize('base')} text-gray-400`}>{item.subtitle}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-3xl font-bold text-white text-center mb-6">CENÁRIOS</h3>
            <div className="grid grid-cols-3 gap-6">
              {slide.scenarios.map((scenario, i) => {
                const ScenarioIcon = scenarioIconMap[scenario.emoji] || TrendingUp;
                return (
                  <div
                    key={i}
                    className={`bg-gradient-to-b ${
                      scenario.emoji === 'trending-up'
                        ? 'from-green-900/40 to-transparent border-green-500'
                        : 'from-gray-900/40 to-transparent border-gray-700'
                    } border-2 rounded-xl p-6 text-center`}
                  >
                    <ScenarioIcon className="w-12 h-12 mx-auto mb-3 text-white" />
                    <p className={`${getTextSize('base')} text-gray-300 mb-2`}>{scenario.label}</p>
                    <p className="text-3xl font-bold text-white">{scenario.value}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // SLIDE: PAYBACK E ROI
  if (slide.type === 'payback-roi') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="grid grid-cols-2 gap-12">
            {/* Payback */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-900/30 to-transparent border-2 border-blue-500 rounded-xl p-8"
            >
              <h3 className="text-4xl font-bold text-blue-400 mb-6 text-center">{slide.payback.title}</h3>
              <div className={`${getTextSize('lg')} text-gray-300 space-y-3 mb-6`}>
                <p>Investimento: <span className="text-white font-bold">{slide.payback.investimento}</span></p>
                <p>Recebe/mês: <span className="text-white font-bold">{slide.payback.recebeMes}</span></p>
                <p>Recupera em: <span className="text-green-400 font-bold text-2xl">{slide.payback.recuperaEm}</span></p>
              </div>
              <div className="space-y-2 mt-8">
                <h4 className="text-xl font-bold text-white mb-4">Timeline:</h4>
                {slide.payback.timeline.map((item, i) => (
                  <div
                    key={i}
                    className={`flex justify-between p-3 rounded-lg ${
                      item.valor.includes('+') ? 'bg-green-900/40 text-green-400' : 'bg-gray-900/40 text-gray-300'
                    }`}
                  >
                    <span>{item.mes}:</span>
                    <span className="font-bold">{item.valor}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ROI */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-900/30 to-transparent border-2 border-green-500 rounded-xl p-8"
            >
              <h3 className="text-4xl font-bold text-green-400 mb-6 text-center">{slide.roi.title}</h3>

              <div className="space-y-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-4">Ano 1:</h4>
                  <div className={`${getTextSize('lg')} text-gray-300 space-y-2`}>
                    <p>Investimento: <span className="text-white font-bold">{slide.roi.ano1.investimento}</span></p>
                    <p>Recebe: <span className="text-white font-bold">{slide.roi.ano1.recebe}</span></p>
                    <p>Lucro: <span className="text-green-400 font-bold text-xl">{slide.roi.ano1.lucro}</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-white mb-4">Ano 2:</h4>
                  <div className={`${getTextSize('lg')} text-gray-300 space-y-2`}>
                    <p>Recebe: <span className="text-white font-bold">{slide.roi.ano2.recebe}</span></p>
                    <p>Lucro: <span className="text-green-400 font-bold text-xl">{slide.roi.ano2.lucro}</span></p>
                  </div>
                </div>

                <div className="border-t-2 border-green-600 pt-6">
                  <h4 className="text-2xl font-bold text-white mb-4">Em 2 anos:</h4>
                  <div className={`${getTextSize('lg')} text-gray-300 space-y-2`}>
                    <p>Total recebido: <span className="text-white font-bold">{slide.roi.doisAnos.totalRecebido}</span></p>
                    <p>Lucro real: <span className="text-green-400 font-bold text-2xl">{slide.roi.doisAnos.lucroReal}</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: TABELA DE CENÁRIOS
  if (slide.type === 'scenarios-table') {
    const tableIconMap = {
      'frown': TrendingDown,
      'smile': TrendingUp,
      'rocket': TrendingUp,
    };

    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-700">
                  {slide.table.headers.map((header, i) => (
                    <th key={i} className="text-2xl font-bold text-red-400 pb-4 text-left px-4 first:pl-0">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.table.rows.map((row, i) => {
                  const RowIcon = tableIconMap[row.emoji] || TrendingUp;
                  return (
                    <tr
                      key={i}
                      className={`border-b border-gray-800 ${row.highlight ? 'bg-green-900/20' : ''}`}
                    >
                      <td className={`${getTextSize('xl')} py-6 px-4 pl-0`}>
                        <RowIcon className="w-10 h-10 inline-block mr-3 text-red-400" />
                        <span className={`font-bold ${row.highlight ? 'text-green-400' : 'text-white'}`}>
                          {row.label}
                        </span>
                      </td>
                      <td className={`${getTextSize('xl')} text-white font-bold py-6 px-4`}>{row.ocupacao}</td>
                      <td className={`${getTextSize('xl')} text-white font-bold py-6 px-4`}>{row.fat}</td>
                      <td className={`${getTextSize('xl')} text-green-400 font-bold py-6 px-4`}>{row.recebe}</td>
                      <td className={`${getTextSize('xl')} text-amber-400 font-bold py-6 px-4`}>{row.roi}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-8"
          >
            <div className={`${getTextSize('base')} text-gray-300 space-y-2`}>
              {slide.footer.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {slide.breakdown && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6">
                <h4 className="text-2xl font-bold text-blue-400 mb-3">{slide.breakdown.title}</h4>
                <div className={`${getTextSize('base')} text-gray-300 space-y-1`}>
                  {slide.breakdown.items.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // SLIDE: DIAGRAMA DAS 5 ENGRENAGENS
  if (slide.type === 'diagram') {
    const diagramIconMap = {
      'wine': Wine,
      'users': Users,
      'dollar-sign': DollarSign,
      'bar-chart-3': BarChart3,
      'smartphone': Smartphone,
    };

    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Diagrama circular */}
            <div className="grid grid-cols-3 gap-8 mb-16">
              {slide.diagram.map((item, i) => {
                const DiagramIcon = diagramIconMap[item.icon] || Settings;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                    className={`bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-500 rounded-2xl p-12 text-center ${
                      i === 1 ? 'col-start-2' : ''
                    }`}
                  >
                    <DiagramIcon className="w-16 h-16 mx-auto mb-4 text-white" />
                    <h3 className="text-3xl font-bold text-white">{item.label}</h3>
                  </motion.div>
                );
              })}
            </div>

            {/* Explicação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-900 border-2 border-gray-700 rounded-xl p-8 text-center"
            >
              <p className={`${getTextSize('xl')} text-gray-300 whitespace-pre-line`}>
                {slide.explanation}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Tipos adicionais podem ser retornados aqui
  return null;
};
