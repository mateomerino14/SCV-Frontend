import {test, expect} from '@playwright/test';
import {loginInBrowser} from './support/helpers';

test('el administrador agrega un tipo nuevo a la escala y lo elimina mientras ningún cargo lo usa', async ({page}) => {
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/cargos');
  await page.getByRole('button', {name: 'Agregar tipo'}).click();
  await expect(page.getByText('Nuevo Tipo de Escala')).toBeVisible();
  await expect(page.getByPlaceholder('D')).toHaveValue('D');
  await page.getByRole('button', {name: 'Agregar', exact: true}).click();
  await expect(page.getByText('La descripción es requerida')).toBeVisible();
  await page.getByPlaceholder('Ej: Consultores externos').fill('Consultores externos');
  const amounts = page.getByPlaceholder('0.00');
  await amounts.nth(0).fill('300');
  await amounts.nth(1).fill('250');
  await amounts.nth(2).fill('200');
  await page.getByPlaceholder('Ej: Hasta 3 estrellas').fill('Hasta 4 estrellas');
  await page.getByRole('button', {name: 'Agregar', exact: true}).click();
  await expect(page.getByText('Se agregó el tipo D a la escala')).toBeVisible();
  await page.getByRole('button', {name: 'Aceptar'}).click();
  await expect(page.getByText('Consultores externos')).toBeVisible();
  await expect(page.getByRole('button', {name: 'Eliminar tipo A'})).toHaveCount(0);
  await page.getByRole('button', {name: 'Eliminar tipo D'}).click();
  await page.getByRole('button', {name: 'Eliminar', exact: true}).click();
  await expect(page.getByText('Se eliminó el tipo D de la escala')).toBeVisible();
  await page.getByRole('button', {name: 'Aceptar'}).click();
  await expect(page.getByText('Consultores externos')).toHaveCount(0);
});
