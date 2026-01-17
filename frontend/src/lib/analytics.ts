/**
 * FLAME Lounge Bar - Google Analytics 4
 *
 * Tracking de eventos e conversões
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Envia evento para Google Analytics
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Eventos de E-commerce
 */

/**
 * Produto visualizado
 */
export const trackViewItem = (product: {
  id: string;
  name: string;
  category: string;
  price: number;
}): void => {
  trackEvent('view_item', {
    currency: 'BRL',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      },
    ],
  });
};

/**
 * Produto adicionado ao carrinho
 */
export const trackAddToCart = (
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
  },
  quantity: number = 1
): void => {
  trackEvent('add_to_cart', {
    currency: 'BRL',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity,
      },
    ],
  });
};

/**
 * Produto removido do carrinho
 */
export const trackRemoveFromCart = (
  product: {
    id: string;
    name: string;
    price: number;
  },
  quantity: number = 1
): void => {
  trackEvent('remove_from_cart', {
    currency: 'BRL',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity,
      },
    ],
  });
};

/**
 * Início do checkout
 */
export const trackBeginCheckout = (
  items: Array<{
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>,
  total: number
): void => {
  trackEvent('begin_checkout', {
    currency: 'BRL',
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

/**
 * Compra finalizada (conversão principal)
 */
export const trackPurchase = (order: {
  id: string;
  total: number;
  tax?: number;
  shipping?: number;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>;
}): void => {
  trackEvent('purchase', {
    transaction_id: order.id,
    value: order.total,
    tax: order.tax || 0,
    shipping: order.shipping || 0,
    currency: 'BRL',
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

/**
 * Eventos de Reserva
 */

/**
 * Reserva iniciada
 */
export const trackReservationStart = (params: {
  date: string;
  time: string;
  people: number;
}): void => {
  trackEvent('reservation_start', params);
};

/**
 * Reserva concluída (conversão)
 */
export const trackReservationComplete = (reservation: {
  id: string;
  date: string;
  time: string;
  people: number;
}): void => {
  trackEvent('generate_lead', {
    currency: 'BRL',
    value: 0, // Reservas não têm valor monetário direto
    lead_type: 'reservation',
    reservation_id: reservation.id,
    reservation_date: reservation.date,
    reservation_time: reservation.time,
    party_size: reservation.people,
  });
};

/**
 * Eventos de Cashback
 */

/**
 * Cashback resgatado
 */
export const trackCashbackRedeemed = (params: {
  amount: number;
  orderId: string;
}): void => {
  trackEvent('cashback_redeemed', {
    currency: 'BRL',
    value: params.amount,
    order_id: params.orderId,
  });
};

/**
 * Eventos de Autenticação
 */

/**
 * Usuário registrou
 */
export const trackSignUp = (method: 'email' | 'google' | 'phone'): void => {
  trackEvent('sign_up', {
    method,
  });
};

/**
 * Usuário fez login
 */
export const trackLogin = (method: 'email' | 'google' | 'phone'): void => {
  trackEvent('login', {
    method,
  });
};

/**
 * Eventos de Engajamento
 */

/**
 * Busca realizada
 */
export const trackSearch = (searchTerm: string): void => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

/**
 * Compartilhamento
 */
export const trackShare = (
  contentType: string,
  contentId: string,
  method: string
): void => {
  trackEvent('share', {
    content_type: contentType,
    content_id: contentId,
    method,
  });
};

/**
 * Página visualizada
 */
export const trackPageView = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID as string, {
      page_path: url,
    });
  }
};

export default {
  trackEvent,
  trackViewItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackReservationStart,
  trackReservationComplete,
  trackCashbackRedeemed,
  trackSignUp,
  trackLogin,
  trackSearch,
  trackShare,
  trackPageView,
};
