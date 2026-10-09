import {test, expect} from '@playwright/test';
import {loginInBrowser} from './support/helpers';

const expectDownload = async (page, buttonName, filePattern) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', {name: buttonName}).first().click(),
  ]);
  expect(download.suggestedFilename()).toMatch(filePattern);
};

test('el administrador exporta sus pantallas a Excel', async ({page}) => {
  await loginInBrowser(page, 'admin.prueba');
  await expectDownload(page, 'Exportar resumen a Excel', /^Resumen_.*\.xlsx$/);
  await page.goto('/dashboard/administrador/usuarios');
  await expectDownload(page, 'Exportar a Excel', /^Usuarios_.*\.xlsx$/);
  await page.goto('/dashboard/administrador/cargos');
  await expectDownload(page, 'Exportar a Excel', /^Cargos_.*\.xlsx$/);
  await page.goto('/dashboard/administrador/secciones');
  await expectDownload(page, 'Exportar a Excel', /^Secciones_.*\.xlsx$/);
});
