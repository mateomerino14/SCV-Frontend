import {test, expect} from '@playwright/test';
import {loginInBrowser} from './support/helpers';

test('las secciones se cargan de a 15 desde el servidor y se buscan sin importar tildes @celular', async ({page}) => {
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/secciones');
  const count = page.getByText(/^Mostrando \d+ de \d+ secci/);
  await expect(count).toHaveText(/^Mostrando 15 de \d+ secciones$/);
  const total = Number((await count.textContent()).match(/de (\d+)/)[1]);
  expect(total).toBeGreaterThan(30);
  await page.getByRole('button', {name: 'Cargar más secciones'}).click();
  await expect(count).toHaveText(`Mostrando 30 de ${total} secciones`);
  await page.getByPlaceholder('Buscar secciones...').fill('administración');
  await expect(count).toHaveText('Mostrando 1 de 1 sección');
  await expect(page.getByText('ADMINISTRACION', {exact: true})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Cargar más secciones'})).toHaveCount(0);
  await page.getByPlaceholder('Buscar secciones...').fill('837');
  await expect(count).toHaveText('Mostrando 1 de 1 sección');
  await page.getByPlaceholder('Buscar secciones...').fill('zzzz sin resultado');
  await expect(page.getByText('No se encontraron', {exact: false})).toBeVisible();
});

test('los usuarios se buscan y filtran en el servidor por nombre, rol y sección', async ({page}) => {
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/usuarios');
  const count = page.getByText(/^Mostrando \d+ de \d+ usuarios?$/);
  await expect(count).toBeVisible();
  await page.getByPlaceholder('Buscar usuarios...').fill('lucia revisora');
  await expect(count).toHaveText('Mostrando 1 de 1 usuario');
  await expect(page.getByText('Lucía Revisora')).toBeVisible();
  await page.getByPlaceholder('Buscar usuarios...').fill('');
  await page.getByRole('button', {name: 'Empleados', exact: true}).click();
  await expect(count).toHaveText(/^Mostrando \d+ de \d+ usuarios?$/);
  await expect(page.getByText('Lucía Revisora')).toHaveCount(0);
  await expect(page.getByText('Juan Empleado')).toBeVisible();
});

test('al crear un cargo sugiere los nombres parecidos y avisa si ya existe', async ({page}) => {
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/cargos');
  await expect(page.getByText(/^Mostrando \d+ de \d+ cargos$/)).toBeVisible();
  await page.getByRole('button', {name: 'Agregar cargo'}).click();
  const name = page.getByPlaceholder('Ej: Especialista de Marketing');
  await name.fill('analista de prue');
  await expect(page.getByText('ya existe')).toBeVisible();
  await name.fill('Analista de Prueba');
  await name.blur();
  await page.getByRole('button', {name: /^Tipo A ·/}).click();
  await page.getByRole('button', {name: 'Registrar'}).click();
  await expect(page.getByText('Ya existe un cargo con el nombre "Analista de Prueba"', {exact: false})).toBeVisible();
});
