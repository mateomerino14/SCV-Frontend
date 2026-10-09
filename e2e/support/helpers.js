import {expect, request} from '@playwright/test';

export const apiUrl = process.env.E2E_API_URL || 'http://localhost:5055';
export const testPassword = 'Prueba1234';

const boliviaOffsetHours = -4;

export const boliviaDate = (extraDays = 0) => {
  const now = new Date(Date.now() + boliviaOffsetHours * 3600000 + extraDays * 86400000);
  return now.toISOString().slice(0, 10);
};

export const loginInBrowser = async (page, user) => {
  await page.goto('/');
  await page.locator('input[type=email]:visible').fill(`${user}@maxam.com`);
  await page.locator('input[type=password]:visible').fill(testPassword);
  await page.getByRole('button', {name: 'Iniciar Sesión'}).first().click();
  await expect(page).toHaveURL(/\/dashboard\//);
};

export const apiClient = async (user) => {
  const context = await request.newContext({baseURL: apiUrl});
  const response = await context.post('/auth', {data: {email_corporativo: `${user}@maxam.com`, contrasenia: testPassword}});
  const {token} = await response.json();
  const headers = {authorization: `Bearer ${token}`};
  return {
    get: async (path) => (await context.get(path, {headers})).json(),
    post: async (path, data = {}) => (await context.post(path, {headers, data})).json(),
    put: async (path, data = {}) => (await context.put(path, {headers, data})).json(),
    postForm: async (path, data) => (await context.post(path, {headers, multipart: {datos: JSON.stringify(data)}})).json(),
  };
};

export const createFundedTrip = async (tripOverrides = {}) => {
  const employee = await apiClient('juan.empleado');
  const me = await employee.get('/user/me');
  const isInternational = tripOverrides.tipo === 'Internacional';
  const trip = await employee.post('/trip', {
    motivo: 'Prueba E2E',
    origen: 'La Paz',
    destino: isInternational ? 'Lima' : 'Santa Cruz',
    fecha_inicio: boliviaDate(),
    fecha_fin: boliviaDate(1),
    tipo: 'Nacional',
    transporte: 'Aéreo',
    monto_solicitado: 2 * parseFloat(me.Cargo.monto_diario),
    monto_solicitado_usd: isInternational ? 2 * parseFloat(me.Cargo.monto_diario_usd) : 0,
    ...tripOverrides,
  });
  const supervisor = await apiClient('maria.supervisora');
  const approver = await apiClient('pedro.aprobador');
  const treasurer = await apiClient('tesoro.prueba');
  await employee.put(`/trip/${trip.id_viaje}/submit-review`);
  await supervisor.post(`/review/trip-review/${trip.id_viaje}/take`);
  await supervisor.post(`/review/trip-review/${trip.id_viaje}/approve`);
  await approver.post(`/approver/trip/${trip.id_viaje}/approve`);
  await treasurer.post(`/treasurer/${trip.id_viaje}/approve`);
  return {tripId: trip.id_viaje, employee, position: me.Cargo};
};
