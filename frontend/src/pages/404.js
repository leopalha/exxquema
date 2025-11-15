import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Home, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Página não encontrada | Red Light</title>
        <meta name="description" content="A página que você procura não existe" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 text-center">
            {/* Animated 404 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="mb-8"
            >
              <div className="relative">
                <h1 className="text-[200px] md:text-[300px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 leading-none select-none">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="w-20 h-20 md:w-32 md:h-32 text-orange-400 opacity-50" />
                </div>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Página não encontrada
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Ops! Parece que você se perdeu nas luzes vermelhas. A página que você procura não existe ou foi movida.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Voltar para Início
              </Link>

              <Link
                href="/cardapio"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-gray-700"
              >
                <Search className="w-5 h-5" />
                Ver Cardápio
              </Link>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 p-6 bg-gray-900 border border-gray-700 rounded-xl"
            >
              <h3 className="text-white font-semibold mb-4">Você pode estar procurando:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  → Início
                </Link>
                <Link
                  href="/cardapio"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  → Cardápio
                </Link>
                <Link
                  href="/historia"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  → Nossa História
                </Link>
                <Link
                  href="/filosofia"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  → Filosofia
                </Link>
              </div>
            </motion.div>

            {/* Decorative lights */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-orange-600 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
          </div>
        </div>
      </Layout>
    </>
  );
}
