/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "请求失败" }));
    throw new Error(error.message || error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authAPI = {
  login: (phone: string, password: string) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    }),
  register: (data: { name: string; phone: string; password: string; school?: string }) =>
    request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
};

// User
export const userAPI = {
  getProfile: (userId: number) => request<any>(`/users/${userId}`),
  updateProfile: (userId: number, data: Record<string, unknown>) =>
    request<any>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Badge
export const badgeAPI = {
  getAll: (userId: number) => request<any>(`/badges?userId=${userId}`),
  getSeries: (userId: number) =>
    request<any>(`/badges/series?userId=${userId}`),
  togglePin: (badgeId: number, userId: number) =>
    request<any>(`/badges/${badgeId}/pin`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
};

// BlindBox
export const blindboxAPI = {
  getDrawCount: (userId: number) =>
    request<any>(`/blindbox/draw-count?userId=${userId}`),
  draw: (userId: number) =>
    request<any>("/blindbox/draw", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
  getCollection: (userId: number) =>
    request<any>(`/blindbox/collection?userId=${userId}`),
};

// Activity
export const activityAPI = {
  getAll: (filters?: Record<string, string>) => {
    const params = filters
      ? "?" + new URLSearchParams(filters).toString()
      : "";
    return request<any>(`/activities${params}`);
  },
  getById: (id: number) => request<any>(`/activities/${id}`),
  register: (activityId: number, userId: number, role: string) =>
    request<any>(`/activities/${activityId}/register`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    }),
  getMyActivities: (userId: number) =>
    request<any>(`/activities/my?userId=${userId}`),
};

// Honor
export const honorAPI = {
  getList: (period: string, category: string, userId?: number) => {
    const params = new URLSearchParams({ period, category });
    if (userId) params.append("userId", String(userId));
    return request<any>(`/honors?${params.toString()}`);
  },
};

// Evaluation
export const evaluationAPI = {
  getByUser: (userId: number) =>
    request<any>(`/evaluations?userId=${userId}`),
  create: (data: Record<string, unknown>) =>
    request<any>("/evaluations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Benefit
export const benefitAPI = {
  getAll: (userId: number) => request<any>(`/benefits?userId=${userId}`),
};

// Admin
export const adminAPI = {
  getStats: () => request<any>("/admin/stats"),
  createShift: (data: Record<string, unknown>) =>
    request<any>("/admin/shifts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getShifts: () => request<any>("/admin/shifts"),
  checkIn: (data: Record<string, unknown>) =>
    request<any>("/admin/attendance/check-in", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  checkOut: (data: Record<string, unknown>) =>
    request<any>("/admin/attendance/check-out", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getVolunteers: () => request<any>("/admin/volunteers"),
};
