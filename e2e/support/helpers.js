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

const signedPaths = [/^\/approver\/trip\/\d+\/approve$/, /^\/review\/(trip|expense)-review\/\d+\/approve$/, /^\/approver\/alcohol-review\/\d+\/approve$/, /^\/trip\/\d+\/confirm-completion$/, /^\/reviewer\/\d+\/approve$/];

const withSignature = (path, data) => {
  if (signedPaths.some((pattern) => pattern.test(path)) && !('contrasenia' in data)) {
    return {...data, contrasenia: testPassword};
  }
  return data;
};

export const apiClient = async (user) => {
  const context = await request.newContext({baseURL: apiUrl});
  const response = await context.post('/auth', {data: {email_corporativo: `${user}@maxam.com`, contrasenia: testPassword}});
  const {token} = await response.json();
  const headers = {authorization: `Bearer ${token}`};
  return {
    get: async (path) => (await context.get(path, {headers})).json(),
    post: async (path, data = {}) => (await context.post(path, {headers, data: withSignature(path, data)})).json(),
    put: async (path, data = {}) => (await context.put(path, {headers, data: withSignature(path, data)})).json(),
    del: async (path) => (await context.delete(path, {headers})).json(),
    postForm: async (path, data) => (await context.post(path, {headers, multipart: {datos: JSON.stringify(data)}})).json(),
  };
};

export const createFundedTrip = async (tripOverrides = {}) => {
  const employee = await apiClient('juan.empleado');
  const me = await employee.get('/user/me');
  const isInternational = tripOverrides.tipo === 'Internacional';
  let destination = 'Santa Cruz';
  let assignedUsd = 0;
  if (isInternational) {
    destination = 'Lima';
    assignedUsd = 2 * parseFloat(me.Cargo.monto_diario_usd);
  }
  const trip = await employee.post('/trip', {
    motivo: 'Prueba E2E',
    origen: 'La Paz',
    destino: destination,
    fecha_inicio: boliviaDate(),
    fecha_fin: boliviaDate(1),
    tipo: 'Nacional',
    transporte: 'Aéreo',
    monto_asignado: 2 * parseFloat(me.Cargo.monto_diario),
    monto_asignado_usd: assignedUsd,
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

export const pickDate = async (page, index, isoDate) => {
  await page.locator('[data-date-field]').nth(index).click();
  const dialog = page.getByRole('dialog', {name: 'Elegir fecha'});
  const target = isoDate.slice(0, 7);
  for (let step = 0; step < 24; step++) {
    const shown = await dialog.getAttribute('data-month');
    if (shown === target) {
      break;
    }
    if (shown < target) {
      await dialog.getByRole('button', {name: 'Mes siguiente'}).click();
    }
    else {
      await dialog.getByRole('button', {name: 'Mes anterior'}).click();
    }
  }
  await dialog.locator(`[data-date="${isoDate}"]`).click();
  await dialog.waitFor({state: 'hidden'});
};

export const signWithPassword = async (page, password = testPassword) => {
  await expect(page.getByAltText('Tu firma digital')).toBeVisible();
  await page.getByLabel('Tu contraseña').fill(password);
};

export const drawSignature = async (page) => {
  const box = await page.getByLabel('Recuadro para firmar').boundingBox();
  await page.mouse.move(box.x + 20, box.y + box.height - 40);
  await page.mouse.down();
  for (let step = 1; step <= 20; step++) {
    await page.mouse.move(box.x + 20 + step * 10, box.y + box.height - 40 - (step % 2) * 40);
  }
  await page.mouse.up();
};
