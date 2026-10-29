import {test, expect} from '@playwright/test';
import {loginInBrowser, boliviaDate, createFundedTrip, pickDate} from './support/helpers';

test('el empleado escribe el gasto en soles y ve su equivalente en USD y Bs', async ({page}) => {
  const {tripId} = await createFundedTrip({tipo: 'Internacional'});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}/registrar-gasto?internacional=true`);
  await pickDate(page, 0, boliviaDate());
  await page.getByText('USD — Dólar estadounidense').first().click();
  await page.getByText('PEN — Sol peruano').first().click();
  await page.locator('input[placeholder="0.00"]').first().fill('375');
  await page.locator('input[placeholder="0.0000"]').first().fill('3.75');
  await page.locator('input[placeholder="6.9600"]').first().fill('6.96');
  await expect(page.getByText('100.00 USD').first()).toBeVisible();
  await expect(page.getByText('696.00 Bs').first()).toBeVisible();
  const usdOption = page.getByRole('radio', {name: 'Dólares (USD)'}).first();
  await expect(usdOption).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('radio', {name: 'Bolivianos (Bs)'}).first().click();
  await expect(page.getByRole('radio', {name: 'Bolivianos (Bs)'}).first()).toHaveAttribute('aria-checked', 'true');
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
    tipo_cambio_bs: 6.96,
  });
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await page.getByText('Control Diario').click();
  await expect(page.getByText(/Excede en 10\.00 USD/).first()).toBeVisible();
});

test('con el fondo solo en Bs el gasto en el exterior se descuenta en Bs con el tipo de cambio de la casa de cambio', async ({page}) => {
  const {tripId, employee} = await createFundedTrip({tipo: 'Internacional', monto_asignado: 2000, monto_asignado_usd: 0});
  await employee.postForm('/expense/register', {
    id_viaje: tripId,
    monto_total: 50,
    fecha_gasto: boliviaDate(),
    tipo: 'S',
    descripcion: 'Taxi en Lima',
    id_categoria: 1,
    es_gasto_internacional: true,
    tipo_cambio_bs: 10,
  });
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await expect(page.getByText('Gasto total (nacional e internacional)')).toBeVisible();
  await expect(page.getByText('500.00 Bs').first()).toBeVisible();
  await expect(page.getByText('1500.00 Bs').first()).toBeVisible();
  await expect(page.getByText('Fondo recibido (USD)')).toHaveCount(0);
});
