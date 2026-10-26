import {test, expect, request} from '@playwright/test';
import {loginInBrowser, boliviaDate, createFundedTrip, apiUrl, testPassword} from './support/helpers';

const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

const registerWithBackups = async (tripId) => {
  const context = await request.newContext({baseURL: apiUrl});
  const login = await context.post('/auth', {data: {email_corporativo: 'juan.empleado@maxam.com', contrasenia: testPassword}});
  const {token} = await login.json();
  const categories = await (await context.get('/expense-category', {headers: {authorization: `Bearer ${token}`}})).json();
  const form = new FormData();
  form.append('datos', JSON.stringify({
    id_viaje: tripId, monto_total: 70, fecha_gasto: boliviaDate(), tipo: 'C', descripcion: 'Compra pagada con cambio de moneda',
    id_categoria_gasto: categories.find((category) => category.nombre.startsWith('626040')).id_categoria, es_gasto_internacional: true,
  }));
  ['imagen', 'respaldos', 'respaldos'].forEach((field, index) => form.append(field, new Blob([tinyPng], {type: 'image/png'}), `imagen${index}.png`));
  const response = await context.post('/expense/register', {headers: {authorization: `Bearer ${token}`}, multipart: form});
  return (await response.json()).gasto.id_gasto;
};

test('en un gasto internacional el empleado quita y agrega respaldos @celular', async ({page}) => {
  const {tripId} = await createFundedTrip({tipo: 'Internacional'});
  const expenseId = await registerWithBackups(tripId);
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/gasto/${expenseId}/editar-gasto?internacional=true`);
  const backups = page.locator('img[alt^="respaldo"]:visible');
  await expect(backups).toHaveCount(2);
  const removedUrl = await backups.first().getAttribute('src');
  await page.getByRole('button', {name: 'Quitar respaldo 1'}).first().click();
  await expect(backups).toHaveCount(1);
  await page.locator('input[type=file][accept="image/*"]').last().setInputFiles({name: 'cambio.png', mimeType: 'image/png', buffer: tinyPng});
  await expect(backups).toHaveCount(2);
  await page.getByRole('button', {name: 'Guardar Cambios'}).click();
  await expect(page.getByText('Gasto Actualizado')).toBeVisible();
  await page.goto(`/dashboard/empleado/gasto/${expenseId}`);
  await expect(page.locator('img[alt^="respaldo"]:visible')).toHaveCount(2);
  await expect(page.locator(`img[src="${removedUrl}"]`)).toHaveCount(0);
});

test('solo los gastos internacionales piden respaldos', async ({page}) => {
  const {tripId} = await createFundedTrip({tipo: 'Internacional'});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}/registrar-gasto?internacional=true`);
  await expect(page.getByText('Respaldos (máx. 2)')).toBeVisible();
  await page.goto(`/dashboard/empleado/viaje/${tripId}/registrar-gasto`);
  await expect(page.getByText('Comprobante').first()).toBeVisible();
  await expect(page.getByText('Respaldos (máx. 2)')).toHaveCount(0);
  const national = await createFundedTrip();
  await page.goto(`/dashboard/empleado/viaje/${national.tripId}/registrar-gasto`);
  await expect(page.getByText('Comprobante').first()).toBeVisible();
  await expect(page.getByText('Respaldos (máx. 2)')).toHaveCount(0);
});
