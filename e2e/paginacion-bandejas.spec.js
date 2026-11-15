import {test, expect} from '@playwright/test';
import {loginInBrowser, apiClient, boliviaDate} from './support/helpers';

const tripsToSend = 13;

test('la bandeja del jefe trae los viajes de a 12 desde el servidor y cuenta cada pestaña', async ({page}) => {
  const employee = await apiClient('juan.empleado');
  for (let index = 0; index < tripsToSend; index++) {
    const trip = await employee.post('/trip', {
      motivo: `Bandeja paginada ${index}`, origen: 'La Paz', destino: 'Oruro', fecha_inicio: boliviaDate(30), fecha_fin: boliviaDate(31),
      tipo: 'Nacional', transporte: 'Terrestre', monto_asignado: 460,
    });
    await employee.put(`/trip/${trip.id_viaje}/submit-review`);
  }
  await loginInBrowser(page, 'maria.supervisora');
  await page.goto('/dashboard/supervisor/viajes-historial');
  const count = page.getByText(/^Mostrando \d+ de \d+ viajes?$/);
  await expect(count).toHaveText(/^Mostrando 12 de \d+ viajes$/);
  const total = Number((await count.textContent()).match(/de (\d+)/)[1]);
  expect(total).toBeGreaterThanOrEqual(tripsToSend);
  await page.getByRole('button', {name: 'Cargar más'}).click();
  await expect(count).toHaveText(`Mostrando ${Math.min(24, total)} de ${total} viajes`);
  await page.getByRole('button', {name: 'Rechazados', exact: true}).click();
  await expect(page.getByText('Bandeja paginada 0')).toHaveCount(0);
  await page.getByRole('button', {name: 'Pendientes', exact: true}).click();
  await expect(count).toHaveText(`Mostrando 12 de ${total} viajes`);
});
