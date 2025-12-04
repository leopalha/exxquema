import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// Status das avaliacoes
export const REVIEW_STATUS = {
  PENDING: 'pendente',
  APPROVED: 'aprovado',
  REJECTED: 'rejeitado'
};

// Categorias de avaliacao
export const REVIEW_CATEGORIES = [
  { id: 'comida', nome: 'Comida', emoji: '🍽️' },
  { id: 'drinks', nome: 'Drinks', emoji: '🍸' },
  { id: 'atendimento', nome: 'Atendimento', emoji: '👨‍🍳' },
  { id: 'ambiente', nome: 'Ambiente', emoji: '✨' },
  { id: 'narguile', nome: 'Narguile', emoji: '💨' }
];

// Avaliacoes mock
const mockReviews = [
  {
    id: 'REV-001',
    orderId: 'ORD-001',
    userId: '6',
    userName: 'Maria Silva',
    userAvatar: null,
    rating: 5,
    comment: 'Experiencia incrivel! A comida estava deliciosa e o atendimento foi impecavel. Com certeza voltarei!',
    categories: {
      comida: 5,
      drinks: 5,
      atendimento: 5,
      ambiente: 5
    },
    photos: [],
    status: REVIEW_STATUS.APPROVED,
    response: 'Obrigado pela avaliacao, Maria! Ficamos felizes que voce tenha gostado. Esperamos ve-la novamente em breve!',
    responseAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 12,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'REV-002',
    orderId: 'ORD-002',
    userId: '7',
    userName: 'Joao Santos',
    userAvatar: null,
    rating: 4,
    comment: 'Otimo lugar para sair com amigos. O narguile e muito bom e o ambiente e aconchegante. Unico ponto de atencao e que o atendimento demorou um pouco.',
    categories: {
      drinks: 4,
      atendimento: 3,
      ambiente: 5,
      narguile: 5
    },
    photos: [],
    status: REVIEW_STATUS.APPROVED,
    response: null,
    responseAt: null,
    helpful: 5,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'REV-003',
    orderId: 'ORD-003',
    userId: '8',
    userName: 'Ana Costa',
    userAvatar: null,
    rating: 5,
    comment: 'Melhor happy hour de Botafogo! Os drinks sao deliciosos e os precos sao justos. Super recomendo!',
    categories: {
      drinks: 5,
      atendimento: 5,
      ambiente: 4
    },
    photos: [],
    status: REVIEW_STATUS.APPROVED,
    response: 'Muito obrigado, Ana! Fico feliz que tenha aproveitado nosso happy hour. Ate a proxima!',
    responseAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const useReviewStore = create(
  persist(
    (set, get) => ({
      // Estado
      reviews: mockReviews,
      loading: false,
      pendingReview: null,

      // Getters
      getAllReviews: () => {
        return get().reviews
          .filter(r => r.status === REVIEW_STATUS.APPROVED)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getReviewsByUser: (userId) => {
        return get().reviews
          .filter(r => r.userId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getReviewByOrder: (orderId) => {
        return get().reviews.find(r => r.orderId === orderId);
      },

      getPendingReviews: () => {
        return get().reviews
          .filter(r => r.status === REVIEW_STATUS.PENDING)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getAverageRating: () => {
        const approvedReviews = get().reviews.filter(r => r.status === REVIEW_STATUS.APPROVED);
        if (approvedReviews.length === 0) return 0;
        const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / approvedReviews.length).toFixed(1);
      },

      getRatingDistribution: () => {
        const approvedReviews = get().reviews.filter(r => r.status === REVIEW_STATUS.APPROVED);
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        approvedReviews.forEach(r => {
          distribution[r.rating]++;
        });

        return distribution;
      },

      getCategoryAverages: () => {
        const approvedReviews = get().reviews.filter(r => r.status === REVIEW_STATUS.APPROVED);
        const categoryTotals = {};
        const categoryCounts = {};

        approvedReviews.forEach(r => {
          if (r.categories) {
            Object.entries(r.categories).forEach(([cat, rating]) => {
              if (!categoryTotals[cat]) {
                categoryTotals[cat] = 0;
                categoryCounts[cat] = 0;
              }
              categoryTotals[cat] += rating;
              categoryCounts[cat]++;
            });
          }
        });

        const averages = {};
        Object.keys(categoryTotals).forEach(cat => {
          averages[cat] = (categoryTotals[cat] / categoryCounts[cat]).toFixed(1);
        });

        return averages;
      },

      getTotalReviews: () => {
        return get().reviews.filter(r => r.status === REVIEW_STATUS.APPROVED).length;
      },

      // Actions
      createReview: async (reviewData) => {
        set({ loading: true });

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const { orderId, userId, userName, rating, comment, categories, photos } = reviewData;

          // Verificar se ja existe avaliacao para este pedido
          if (get().getReviewByOrder(orderId)) {
            toast.error('Voce ja avaliou este pedido');
            return { success: false, error: 'Avaliacao ja existe' };
          }

          const newReview = {
            id: `REV-${Date.now().toString().slice(-6)}`,
            orderId,
            userId,
            userName,
            userAvatar: null,
            rating,
            comment,
            categories: categories || {},
            photos: photos || [],
            status: REVIEW_STATUS.APPROVED, // Auto-aprovar para demo
            response: null,
            responseAt: null,
            helpful: 0,
            createdAt: new Date().toISOString()
          };

          set(state => ({
            reviews: [newReview, ...state.reviews]
          }));

          toast.success('Obrigado pela sua avaliacao!');
          return { success: true, review: newReview };
        } catch (error) {
          toast.error('Erro ao enviar avaliacao');
          return { success: false, error: 'Erro ao criar avaliacao' };
        } finally {
          set({ loading: false });
        }
      },

      // Responder avaliacao (admin)
      respondToReview: async (reviewId, response) => {
        set({ loading: true });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            reviews: state.reviews.map(r =>
              r.id === reviewId
                ? {
                    ...r,
                    response,
                    responseAt: new Date().toISOString()
                  }
                : r
            )
          }));

          toast.success('Resposta enviada!');
          return { success: true };
        } catch (error) {
          toast.error('Erro ao responder');
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      // Marcar como util
      markHelpful: (reviewId) => {
        set(state => ({
          reviews: state.reviews.map(r =>
            r.id === reviewId
              ? { ...r, helpful: r.helpful + 1 }
              : r
          )
        }));
      },

      // Aprovar/Rejeitar avaliacao (admin)
      updateReviewStatus: (reviewId, status) => {
        set(state => ({
          reviews: state.reviews.map(r =>
            r.id === reviewId
              ? { ...r, status }
              : r
          )
        }));

        const message = status === REVIEW_STATUS.APPROVED
          ? 'Avaliacao aprovada'
          : 'Avaliacao rejeitada';
        toast.success(message);
      },

      // Verificar se usuario pode avaliar pedido
      canReviewOrder: (orderId, userId) => {
        const existingReview = get().getReviewByOrder(orderId);
        return !existingReview;
      },

      // Limpar avaliacoes (para testes)
      clearReviews: () => {
        set({ reviews: [], pendingReview: null });
      }
    }),
    {
      name: 'flame-reviews-storage',
      partialize: (state) => ({
        reviews: state.reviews
      })
    }
  )
);

export { useReviewStore };
export default useReviewStore;
