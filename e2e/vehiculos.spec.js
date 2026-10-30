import {test, expect} from '@playwright/test';
import {loginInBrowser} from './support/helpers';

test('el administrador registra un vehículo y lo ve libre en la flota', async ({page}) => {
  const plate = `E${Date.now() % 100000}-ZZ`;
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/vehiculos');
  await expect(page.getByText('2345-ABC')).toBeVisible();
  await page.getByRole('button', {name: 'Registrar vehículo'}).click();
  const dialog = page.getByRole('dialog', {name: 'Registrar vehículo'});
  await dialog.getByPlaceholder('Ej: 2345-ABC').fill(plate.toLowerCase());
  await dialog.getByPlaceholder('Ej: Camioneta Toyota Hilux').fill('Camioneta de prueba');
  await dialog.getByRole('button', {name: 'Registrar'}).click();
  await expect(page.getByText('Vehículo registrado correctamente')).toBeVisible();
  await page.getByRole('button', {name: 'Aceptar'}).click();
  await expect(page.getByText(plate)).toBeVisible();
});
