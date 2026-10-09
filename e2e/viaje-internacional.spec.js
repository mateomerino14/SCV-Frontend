import {test, expect} from '@playwright/test';
import {loginInBrowser, boliviaDate, createFundedTrip} from './support/helpers';

test('el tipo de cambio del día se obtiene solo al registrar un tramo', async ({page}) => {
  const {tripId} = await createFundedTrip({tipo: 'Internacional'});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}/registrar-gasto?internacional=true`);
  await page.locator('input[type=date]').first().fill(boliviaDate());
  await page.getByRole('switch', {name: 'Cambio de Moneda (Tramos)'}).first().click();
  await expect(page.getByText(/Tipo de cambio del/).first()).toBeVisible();
  await page.locator('input[placeholder="0.00"]').last().fill('375');
  await expect(page.getByText(/1 USD = 0\.8800 EUR/).first()).toBeVisible();
  await expect(page.getByText(/= 426\.14 USD/).first()).toBeVisible();
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
