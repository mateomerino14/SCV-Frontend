import {test, expect} from '@playwright/test';
import {loginInBrowser, boliviaDate, createFundedTrip} from './support/helpers';

test('el empleado solicita un monto con referencia y tope @celular', async ({page}) => {
  await loginInBrowser(page, 'juan.empleado');
  await page.goto('/dashboard/empleado/crear-viaje');
  await page.getByPlaceholder('Inspección técnica y de producción...').fill('Prueba de tope');
  await page.getByPlaceholder(/Ciudad de origen|Obteniendo ubicación/).fill('La Paz');
  await page.getByPlaceholder('¿A dónde se dirige?').fill('Santa Cruz');
  const dates = page.locator('input[type=date]');
  await dates.nth(0).fill(boliviaDate(5));
  await dates.nth(1).fill(boliviaDate(7));
  await expect(page.getByText('Tope a solicitar').first()).toBeVisible();
  const amounts = page.locator('input[placeholder="0.00"]');
  await amounts.last().fill('999999');
  await page.getByRole('button', {name: 'Guardar Borrador'}).click();
  await expect(page.getByText(/No puede superar/).first()).toBeVisible();
  await page.getByText('Solicitar el tope completo').click();
  await page.getByRole('button', {name: 'Guardar Borrador'}).click();
  await expect(page.getByText('Se registró el viaje correctamente')).toBeVisible();
});

test('un día que pasa la tarifa se marca en el control diario y pide justificación', async ({page}) => {
  const {tripId, employee, position} = await createFundedTrip();
  await employee.postForm('/expense/register', {
    id_viaje: tripId,
    monto_total: parseFloat(position.monto_diario) + 50,
    fecha_gasto: boliviaDate(),
    tipo: 'S',
    descripcion: 'Taxi y almuerzo',
    id_categoria: 1,
  });
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}`);
  await expect(page.getByText('Control Diario')).toBeVisible();
  await expect(page.getByText(/1 día por justificar/)).toBeVisible();
  await page.getByText('Control Diario').click();
  await expect(page.getByText(/Excede en 50\.00 Bs/).first()).toBeVisible();
  await expect(page.getByText('Justificación de Excesos')).toBeVisible();
  await page.getByPlaceholder('Detalle el motivo del exceso de este día...').fill('Reunión extendida con el cliente');
  await page.getByText('Control Diario').click();
  await expect(page.getByText(/1 día justificado/)).toBeVisible();
});
