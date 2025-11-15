import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { timelineData, fatosHistoricos, citacoesHistoricas, secaoManifesto } from '../data/historia';
import { Clock, MapPin, Calendar, Book } from 'lucide-react';

export default function Historia() {
  const [selectedEra, setSelectedEra] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Head>
        <title>Nossa História | Exxquema - Networking em Botafogo</title>
        <meta name="description" content="Do networking brasileiro ao esquema perfeito em Botafogo. Conheça a história do Exxquema na 8ª rua mais cool do mundo." />
      </Head>

      <Layout>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.section
            variants={itemVariants}
            className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-orange-900/30 to-black overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-40 right-20 w-48 h-48 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-block bg-orange-500/20 border border-orange-500 px-6 py-2 rounded-full mb-6">
                  <span className="text-orange-400 font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Do Networking ao Esquema Perfeito
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {secaoManifesto.titulo}
              </motion.h1>

              <motion.p
                className="text-2xl md:text-3xl text-orange-400 mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {secaoManifesto.subtitulo}
              </motion.p>

              <motion.p
                className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                No Brasil, "ter esquema" sempre significou estar preparado, ter as conexões certas.
                Em Botafogo, na 8ª rua mais cool do mundo, criamos o esquema perfeito.
              </motion.p>

              <motion.div
                className="mt-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a
                  href="#timeline"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]"
                >
                  <Book className="w-5 h-5" />
                  Explore a Jornada
                </a>
              </motion.div>
            </div>
          </motion.section>

          {/* Timeline Section */}
          <motion.section
            id="timeline"
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Linha do Tempo
                </h2>
                <p className="text-xl text-gray-400">
                  Do networking brasileiro ao Exxquema
                </p>
              </div>

              <div className="relative">
                {/* Linha vertical */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-amber-400 to-orange-500" />

                {timelineData.map((evento, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative mb-12 md:mb-20 ${
                      index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                    }`}
                  >
                    {/* Ponto na linha */}
                    <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full ${
                      evento.destaque ? 'bg-orange-500 ring-4 ring-orange-500/30' : 'bg-amber-400'
                    } shadow-lg`} />

                    {/* Card */}
                    <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                      <div className={`bg-gradient-to-br ${
                        evento.destaque
                          ? 'from-[#1a1a1a] to-[#0a0a0a] border-orange-500'
                          : 'from-[#1a1a1a] to-[#0a0a0a] border-[#262626]'
                      } border-2 rounded-xl p-6 hover:border-orange-400 transition-all duration-300 shadow-xl hover:shadow-2xl`}>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`text-2xl font-bold ${
                            evento.destaque ? 'text-orange-500' : 'text-amber-400'
                          }`}>
                            {evento.ano}
                          </span>
                          <span className="text-sm bg-[#262626] px-3 py-1 rounded-full text-gray-400">
                            {evento.era}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">
                          {evento.titulo}
                        </h3>

                        <p className="text-gray-400 leading-relaxed">
                          {evento.descricao}
                        </p>

                        {evento.destaque && (
                          <div className="mt-4 inline-block bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
                            <span className="text-orange-400 text-sm font-semibold">
                              ★ Momento Histórico
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Fatos Históricos */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-[#0a0a0a]"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Curiosidades Históricas
                </h2>
                <p className="text-xl text-gray-400">
                  Fatos fascinantes sobre o Exxquema e networking
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fatosHistoricos.map((fato) => (
                  <motion.div
                    key={fato.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-6 hover:border-orange-400 transition-all shadow-lg"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-500 font-bold text-sm">{fato.id}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs bg-[#262626] px-2 py-1 rounded-full text-gray-500">
                          {fato.categoria}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {fato.titulo}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed">
                      {fato.texto}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Citações */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Palavras que Iluminam
                </h2>
              </div>

              <div className="space-y-8">
                {citacoesHistoricas.map((citacao, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="border-l-4 border-orange-400 pl-6 py-4"
                  >
                    <p className="text-xl md:text-2xl text-gray-300 italic leading-relaxed mb-4">
                      "{citacao.texto}"
                    </p>
                    <div className="flex items-center gap-2 text-orange-400">
                      <span className="font-semibold">{citacao.autor}</span>
                      {citacao.ano && <span className="text-gray-500">• {citacao.ano}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Manifesto Final */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-gradient-to-br from-orange-900/30 via-black to-orange-900/50"
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                {secaoManifesto.titulo}
              </h2>

              <div className="prose prose-invert prose-lg mx-auto mb-12">
                {secaoManifesto.texto.split('\n\n').map((paragrafo, index) => (
                  <p key={index} className="text-gray-300 leading-relaxed mb-6">
                    {paragrafo.trim()}
                  </p>
                ))}
              </div>

              {/* Manifesto Destaque */}
              <div className="bg-black/50 border-2 border-orange-500/30 rounded-2xl p-8 mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-8">
                  {secaoManifesto.manifestoDestaque.titulo}
                </h3>

                <div className="space-y-4 mb-8">
                  {secaoManifesto.manifestoDestaque.parrafos.map((linha, index) => (
                    linha.trim() ? (
                      <p key={index} className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        {linha}
                      </p>
                    ) : (
                      <div key={index} className="h-4" />
                    )
                  ))}
                </div>

                <div className="border-t border-amber-400/30 pt-8 space-y-3">
                  {secaoManifesto.manifestoDestaque.conclusao.map((linha, index) => (
                    <p key={index} className="text-xl md:text-2xl font-bold text-amber-400">
                      {linha}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/conceito"
                  className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
                >
                  Nosso Conceito
                </Link>
                <Link
                  href="/cardapio"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]"
                >
                  Ver Cardápio
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </Layout>
    </>
  );
}
