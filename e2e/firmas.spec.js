import {test, expect} from '@playwright/test';
import {loginInBrowser, apiClient, boliviaDate, createFundedTrip, drawSignature} from './support/helpers';
test('el aprobador firma en el recuadro para aprobar el viaje @celular', async ({page}) => {
  const employee = await apiClient('juan.empleado');
  const supervisor = await apiClient('maria.supervisora');
  const trip = await employee.post('/trip', {
    motivo: `Viaje para firmar ${Date.now()}`, origen: 'La Paz', destino: 'Oruro', fecha_inicio: boliviaDate(4), fecha_fin: boliviaDate(5), tipo: 'Nacional', transporte: 'Terrestre', monto_asignado: 600,
  });
  await employee.put(`/trip/${trip.id_viaje}/submit-review`);
  await supervisor.post(`/review/trip-review/${trip.id_viaje}/take`);
  await supervisor.post(`/review/trip-review/${trip.id_viaje}/approve`);
  await loginInBrowser(page, 'pedro.aprobador');
  await page.goto(`/dashboard/aprobador/viaje-previo/${trip.id_viaje}`);
  await page.getByRole('button', {name: 'Aprobar Viaje'}).click();
  const confirm = page.getByRole('button', {name: 'Firmar y aprobar'});
  await expect(confirm).toBeDisabled();
  await drawSignature(page);
  await expect(confirm).toBeEnabled();
  await page.getByRole('button', {name: 'Borrar'}).click();
  await expect(confirm).toBeDisabled();
  await drawSignature(page);
  await confirm.click();
  await expect.poll(async () => (await employee.get(`/trip/${trip.id_viaje}`)).viaje.estado).toBe('EN_REVISION_TESORERO');
});

test('el empleado firma al enviar la rendición y la firma queda en la planilla', async ({page}) => {
  const {tripId, employee} = await createFundedTrip();
  await employee.postForm('/expense/register', {id_viaje: tripId, monto_total: 30, fecha_gasto: boliviaDate(), tipo: 'S', descripcion: 'Taxi', id_categoria: 1});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await page.getByRole('button', {name: 'Confirmar Finalización'}).click();
  await drawSignature(page);
  await page.getByRole('button', {name: 'Firmar y enviar'}).click();
  await expect.poll(async () => (await employee.get(`/trip/${tripId}/firmas-planilla`)).preparado?.nombre).toBe('Juan Empleado');
});

test('la página pública avisa cuando un código no existe', async ({page}) => {
  await page.goto('/verificar/AAAA-BBBB-CCCC');
  await expect(page.getByText('No pudimos verificar el documento')).toBeVisible();
  await page.getByLabel('Código del documento').fill('zzzz');
  await page.getByRole('button', {name: 'Verificar'}).click();
  await expect(page.getByText('El código no es válido')).toBeVisible();
});
