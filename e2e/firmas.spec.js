import {test, expect} from '@playwright/test';
import {loginInBrowser, apiClient, boliviaDate, createFundedTrip, drawSignature, signWithPassword, testPassword} from './support/helpers';
test('el aprobador firma con su firma guardada y su contraseña para aprobar el viaje @celular', async ({page}) => {
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
  await signWithPassword(page, 'otra-clave');
  await confirm.click();
  await expect(page.getByText('La contraseña no es correcta')).toBeVisible();
  await page.getByLabel('Tu contraseña').fill(testPassword);
  await confirm.click();
  await expect.poll(async () => (await employee.get(`/trip/${trip.id_viaje}`)).viaje.estado).toBe('EN_REVISION_TESORERO');
});

test('el usuario registra y cambia su firma digital en su perfil @celular', async ({page}) => {
  await loginInBrowser(page, 'carlos.empleado');
  await page.goto('/dashboard/empleado/perfil');
  await expect(page.getByText('Firma Digital', {exact: true})).toBeVisible();
  await expect(page.getByAltText('Tu firma digital')).toBeVisible();
  await page.getByRole('button', {name: 'Cambiar firma'}).click();
  const save = page.getByRole('button', {name: 'Guardar firma'});
  await expect(save).toBeDisabled();
  await drawSignature(page);
  await page.getByLabel('Tu contraseña').fill(testPassword);
  await save.click();
  await expect(page.getByText('Tu firma digital quedó registrada.')).toBeVisible();
});

test('el empleado firma al enviar la rendición y la firma queda en la planilla', async ({page}) => {
  const {tripId, employee} = await createFundedTrip();
  await employee.postForm('/expense/register', {id_viaje: tripId, monto_total: 30, fecha_gasto: boliviaDate(), tipo: 'S', descripcion: 'Taxi', id_categoria: 1});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await page.getByRole('button', {name: 'Confirmar Finalización'}).click();
  await signWithPassword(page);
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
