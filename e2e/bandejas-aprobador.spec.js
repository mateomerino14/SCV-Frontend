import {test, expect} from '@playwright/test';
import {loginInBrowser, apiClient, boliviaDate} from './support/helpers';

test('el aprobador ve en una sola bandeja el viaje de su equipo que le toca como jefe directo', async ({page}) => {
  const reason = `Viaje de su equipo ${Date.now()}`;
  const supervisor = await apiClient('maria.supervisora');
  const trip = await supervisor.post('/trip', {
    motivo: reason, origen: 'La Paz', destino: 'Oruro', fecha_inicio: boliviaDate(8), fecha_fin: boliviaDate(9), tipo: 'Nacional', transporte: 'Terrestre', monto_asignado: 600,
  });
  await supervisor.put(`/trip/${trip.id_viaje}/submit-review`);
  await loginInBrowser(page, 'pedro.aprobador');
  await page.goto('/dashboard/aprobador/revisiones');
  const card = page.locator('div', {hasText: reason}).filter({hasText: 'Mi equipo'}).last();
  await expect(card).toBeVisible();
  await page.getByRole('button', {name: 'Abrir menú'}).click();
  const nav = page.getByRole('navigation', {name: 'Menú principal'});
  await expect(nav.getByRole('link', {name: 'Rendiciones por Revisar'})).toBeVisible();
  await expect(nav.getByRole('link', {name: 'Viajes de Mi Equipo'})).toHaveCount(0);
});
