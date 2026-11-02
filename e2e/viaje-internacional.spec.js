import {test, expect} from '@playwright/test';
import {loginInBrowser, boliviaDate, createFundedTrip, pickDate} from './support/helpers';

test('el empleado elige primero cómo rinde el gasto y solo se pide el tipo de cambio que hace falta @celular', async ({page}) => {
  const {tripId} = await createFundedTrip({tipo: 'Internacional'});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}/registrar-gasto?internacional=true`);
  await pickDate(page, 0, boliviaDate());
  await page.getByText('USD — Dólar estadounidense').first().click();
  await page.getByText('PEN — Sol peruano').first().click();
  await page.locator('input[placeholder="0.00"]').first().fill('375');
  await expect(page.getByRole('radio', {name: 'Dólares (USD)'}).first()).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByLabel('Tipo de cambio: cuántos Bs vale 1 USD')).toHaveCount(0);
  await page.getByLabel('Tipo de cambio: cuántos PEN vale 1 USD').fill('3.75');
  await expect(page.getByText('100.00 USD').first()).toBeVisible();
  await page.getByRole('radio', {name: 'Bolivianos (Bs)'}).first().click();
  await expect(page.getByLabel('Tipo de cambio: cuántos PEN vale 1 USD')).toHaveCount(0);
  await page.getByLabel('Tipo de cambio: cuántos Bs vale 1 PEN').fill('1.85');
  await expect(page.getByText('693.75 Bs').first()).toBeVisible();
  await page.getByRole('radio', {name: 'Ambos'}).first().click();
  await page.getByLabel('Tipo de cambio: cuántos PEN vale 1 USD').fill('3.75');
  await page.getByLabel('Tipo de cambio: cuántos Bs vale 1 USD').fill('6.96');
  await expect(page.getByText('100.00 USD').first()).toBeVisible();
  await expect(page.getByText('696.00 Bs').first()).toBeVisible();
});

test('con fondo solo en Bs el gasto rendido solo en Bs se guarda en bolivianos', async ({page}) => {
  const {tripId} = await createFundedTrip({tipo: 'Internacional', monto_asignado: 2000, monto_asignado_usd: 0});
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}/registrar-gasto?internacional=true`);
  await pickDate(page, 0, boliviaDate());
  await page.getByText('USD — Dólar estadounidense').first().click();
  await page.getByText('PEN — Sol peruano').first().click();
  await expect(page.getByRole('radio', {name: 'Bolivianos (Bs)'}).first()).toHaveAttribute('aria-checked', 'true');
  await page.locator('input[placeholder="0.00"]').first().fill('170');
  await page.getByLabel('Tipo de cambio: cuántos Bs vale 1 PEN').fill('1.85');
  await expect(page.getByText('314.50 Bs').first()).toBeVisible();
  await page.getByPlaceholder('Detalle el motivo del gasto...').first().fill('Taxi en Lima');
  await page.getByText('Seleccione una Categoría').first().click();
  await page.getByPlaceholder('Busca por cuenta, nombre o para qué se usa...').fill('626010');
  await page.getByText(/626010 TAXIS/).last().click();
  await page.getByRole('button', {name: 'Guardar 1 gasto'}).click();
  await expect(page.getByText('1 gasto guardado correctamente')).toBeVisible();
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await expect(page.getByText('314.50 Bs').first()).toBeVisible();
  await expect(page.getByText('170.00 PEN → Bs').first()).toBeVisible();
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

test('con el fondo solo en Bs el control diario de un día intermedio va en Bs con la tarifa en USD por el T/C del fondo', async ({page}) => {
  const {tripId, employee, position} = await createFundedTrip({tipo: 'Internacional', fecha_inicio: boliviaDate(-1), fecha_fin: boliviaDate(1), monto_asignado: 3000, monto_asignado_usd: 0});
  const usdRate = parseFloat(position.monto_diario_usd);
  await employee.postForm('/expense/register', {
    id_viaje: tripId, monto_total: usdRate + 10, fecha_gasto: boliviaDate(), tipo: 'S', descripcion: 'Almuerzo en Lima', id_categoria: 1, es_gasto_internacional: true, tipo_cambio_bs: 10,
  });
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await page.getByText('Control Diario').click();
  const excess = (usdRate + 10) * 10 - usdRate * 6.96;
  await expect(page.getByText(`Excede en ${excess.toFixed(2)} Bs`).first()).toBeVisible();
  await expect(page.getByText(`Fondo solo en Bs: límite de ${usdRate.toFixed(2)} USD × T/C del fondo 6.9600`).first()).toBeVisible();
});
