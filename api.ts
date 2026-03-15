// src/utils/api.ts
// API Service Layer — À connecter à ton backend Node.js/Express

const BASE_URL = __DEV__
  ? 'http://localhost:3000/api'      // Dev local
  : 'https://api.blade-barber.com/api'; // Production

// ── Headers ───────────────────────────────────────────
const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ── Base fetch ────────────────────────────────────────
const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<any> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...getHeaders(token), ...options.headers },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Erreur ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error('[API Error]', endpoint, err);
    throw err;
  }
};

// ══════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════
export const authAPI = {
  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    firstName: string; lastName: string; email: string;
    phone: string; password: string; role: 'client' | 'barber';
  }) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refreshToken: (refreshToken: string) =>
    apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  logout: (token: string) =>
    apiFetch('/auth/logout', { method: 'POST' }, token),
};

// ══════════════════════════════════════════════════════
// BARBIERS
// ══════════════════════════════════════════════════════
export const barbierAPI = {
  getAll: (filters?: { context?: string; zone?: string; available?: boolean }, token?: string) => {
    const params = new URLSearchParams(filters as any).toString();
    return apiFetch(`/barbiers${params ? '?' + params : ''}`, {}, token);
  },

  getById: (id: string, token?: string) =>
    apiFetch(`/barbiers/${id}`, {}, token),

  getAvailableSlots: (barbierId: string, date: string, token?: string) =>
    apiFetch(`/barbiers/${barbierId}/slots?date=${date}`, {}, token),

  getReviews: (barbierId: string, token?: string) =>
    apiFetch(`/barbiers/${barbierId}/reviews`, {}, token),
};

// ══════════════════════════════════════════════════════
// RÉSERVATIONS
// ══════════════════════════════════════════════════════
export const bookingAPI = {
  create: (data: {
    barbierId: string; service: string; date: string;
    time: string; location: string; price: number;
  }, token: string) =>
    apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getMyBookings: (token: string) =>
    apiFetch('/bookings/me', {}, token),

  getById: (id: string, token: string) =>
    apiFetch(`/bookings/${id}`, {}, token),

  cancel: (id: string, token: string) =>
    apiFetch(`/bookings/${id}/cancel`, { method: 'PUT' }, token),

  confirm: (id: string, token: string) =>
    apiFetch(`/bookings/${id}/confirm`, { method: 'PUT' }, token),
};

// ══════════════════════════════════════════════════════
// PAIEMENT (Stripe)
// ══════════════════════════════════════════════════════
export const paymentAPI = {
  createPaymentIntent: (amount: number, bookingId: string, token: string) =>
    apiFetch('/payments/intent', {
      method: 'POST',
      body: JSON.stringify({ amount, bookingId }),
    }, token),

  confirmPayment: (paymentIntentId: string, bookingId: string, token: string) =>
    apiFetch('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, bookingId }),
    }, token),

  refund: (bookingId: string, token: string) =>
    apiFetch(`/payments/refund/${bookingId}`, { method: 'POST' }, token),
};

// ══════════════════════════════════════════════════════
// TRACKING
// ══════════════════════════════════════════════════════
export const trackingAPI = {
  getBarberLocation: (bookingId: string, token: string) =>
    apiFetch(`/tracking/${bookingId}/location`, {}, token),

  updateBarberLocation: (bookingId: string, lat: number, lng: number, token: string) =>
    apiFetch(`/tracking/${bookingId}/update`, {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
    }, token),
};

// ══════════════════════════════════════════════════════
// AVIS
// ══════════════════════════════════════════════════════
export const reviewAPI = {
  create: (data: {
    bookingId: string; barbierId: string; rating: number; comment: string;
  }, token: string) =>
    apiFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getForBarber: (barbierId: string) =>
    apiFetch(`/reviews/barber/${barbierId}`),
};

// ══════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════
export const notifAPI = {
  getAll: (token: string) =>
    apiFetch('/notifications', {}, token),

  markRead: (id: string, token: string) =>
    apiFetch(`/notifications/${id}/read`, { method: 'PUT' }, token),

  markAllRead: (token: string) =>
    apiFetch('/notifications/read-all', { method: 'PUT' }, token),

  registerPushToken: (pushToken: string, platform: 'ios' | 'android', token: string) =>
    apiFetch('/notifications/register', {
      method: 'POST',
      body: JSON.stringify({ pushToken, platform }),
    }, token),
};

// ══════════════════════════════════════════════════════
// PROFIL
// ══════════════════════════════════════════════════════
export const profileAPI = {
  getMe: (token: string) =>
    apiFetch('/users/me', {}, token),

  update: (data: Partial<{ firstName: string; lastName: string; phone: string; avatar: string }>, token: string) =>
    apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),

  getLoyalty: (token: string) =>
    apiFetch('/users/me/loyalty', {}, token),
};
