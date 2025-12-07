/**
 * No-Show Check Job - FLAME Lounge Bar
 * Marca reservas como no-show 15 minutos após o horário
 */

const { Reservation } = require('../models');
const { Op } = require('sequelize');

/**
 * Verifica reservas que passaram do horário e marca como no-show
 * Executa a cada 15 minutos
 */
async function checkNoShows() {
  const startTime = Date.now();
  console.log(`[NO-SHOW] Iniciando verificação - ${new Date().toISOString()}`);

  try {
    const now = new Date();

    // Horário limite: 15 minutos atrás
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Buscar reservas confirmadas que:
    // 1. Já passaram 15 minutos do horário agendado
    // 2. Cliente não chegou (arrivedAt é null)
    const noShowReservations = await Reservation.findAll({
      where: {
        status: 'confirmed',
        arrivedAt: null,
        reservationDate: {
          [Op.lte]: fifteenMinutesAgo  // reservationDate inclui data E hora
        }
      }
    });

    console.log(`[NO-SHOW] Encontradas ${noShowReservations.length} reservas para marcar como no-show`);

    let markedCount = 0;

    for (const reservation of noShowReservations) {
      try {
        await reservation.update({
          status: 'no_show',
          guestNotes: (reservation.guestNotes || '') + `\n[Sistema] Marcado como no-show automaticamente em ${now.toISOString()}`
        });
        markedCount++;

        console.log(`[NO-SHOW] Reserva ${reservation.confirmationCode} marcada como no-show`);
      } catch (error) {
        console.error(`[NO-SHOW] Erro ao marcar reserva ${reservation.id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[NO-SHOW] Concluído em ${duration}ms - ${markedCount} reservas marcadas`);

    return {
      success: true,
      markedCount,
      duration
    };
  } catch (error) {
    console.error('[NO-SHOW] Erro no job:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'noShow',
  schedule: '*/15 * * * *', // A cada 15 minutos
  handler: checkNoShows
};
