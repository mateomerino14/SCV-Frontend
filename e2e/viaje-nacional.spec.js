import {test, expect} from '@playwright/test';
import {loginInBrowser, boliviaDate, createFundedTrip, pickDate} from './support/helpers';

test('el sistema calcula el monto del viaje con la tarifa del cargo @celular', async ({page}) => {
  await loginInBrowser(page, 'juan.empleado');
  await page.goto('/dashboard/empleado/crear-viaje');
  await page.getByPlaceholder('Inspección técnica y de producción...').fill('Prueba de monto');
  await page.getByPlaceholder('Ciudad de origen...').fill('La Paz');
  await page.getByPlaceholder('¿A dónde se dirige?').fill('Santa Cruz');
  await pickDate(page, 0, boliviaDate(5));
  await pickDate(page, 1, boliviaDate(7));
  await expect(page.getByText('Monto Total Estimado').first()).toBeVisible();
  await expect(page.getByText(/900\.00/).first()).toBeVisible();
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

test('en vehículo de la empresa elige un vehículo libre, el combustible aparte y quién gestiona el hospedaje @celular', async ({page}) => {
  await loginInBrowser(page, 'juan.empleado');
  await page.goto('/dashboard/empleado/crear-viaje');
  await page.getByPlaceholder('Inspección técnica y de producción...').fill('Visita en camioneta');
  await page.getByPlaceholder('Ciudad de origen...').fill('Cochabamba');
  await page.getByPlaceholder('¿A dónde se dirige?').fill('Oruro');
  await pickDate(page, 0, boliviaDate(5));
  await pickDate(page, 1, boliviaDate(7));
  await page.getByRole('button', {name: 'Vehículo de Empresa'}).click();
  await page.getByRole('button', {name: 'Guardar Borrador'}).click();
  await expect(page.getByText('Elige el vehículo de la empresa')).toBeVisible();
  await page.getByRole('button', {name: 'Elige un vehículo libre'}).click();
  await page.getByText('3456-BCD — Vagoneta Nissan Patrol').click();
  await page.getByLabel('Fondo para combustible').fill('400');
  await expect(page.getByText('Combustible (aparte)')).toBeVisible();
  await expect(page.getByText(/1300\.00/).first()).toBeVisible();
  await page.getByRole('radio', {name: 'Empresa'}).click();
  await page.getByRole('button', {name: 'Guardar Borrador'}).click();
  await expect(page.getByText('Se registró el viaje correctamente')).toBeVisible();
});
