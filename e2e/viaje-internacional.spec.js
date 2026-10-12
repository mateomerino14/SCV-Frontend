import {test, expect} from '@playwright/test';
import {loginInBrowser, boliviaDate, createFundedTrip} from './support/helpers';

test('el empleado registra el tipo de cambio de cada tramo', async ({page}) => {
  const {tripId} = await createFundedTrip({tipo: 'Internacional'});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}/registrar-gasto?internacional=true`);
  await page.locator('input[type=date]').first().fill(boliviaDate());
  await page.getByRole('switch', {name: 'Cambio de Moneda (Tramos)'}).first().click();
  await page.locator('input[placeholder="0.00"]').nth(1).fill('375');
  await page.locator('input[placeholder="0.0000"]').first().fill('3.75');
  await expect(page.getByText(/= 100\.00 USD/).first()).toBeVisible();
});

test('el control diario de un viaje internacional muestra Bs y USD por separado', async ({page}) => {
  const {tripId, employee, position} = await createFundedTrip({tipo: 'Internacional'});
  await employee.postForm('/expense/register', {
    id_viaje: tripId,
    monto_total: parseFloat(position.monto_diario_usd) + 10,
    fecha_gasto: boliviaDate(),
    tipo: 'S',
    descripcion: 'Taxi en Lima',
    id_categoria: 1,
    es_gasto_internacional: true,
  });
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await page.getByText('Control Diario').click();
  await expect(page.getByText(/Excede en 10\.00 USD/).first()).toBeVisible();
});
