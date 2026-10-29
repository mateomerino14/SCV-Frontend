import {test, expect} from '@playwright/test';
import {loginInBrowser, apiClient} from './support/helpers';

const editedUser = 'Carlos';
const editButtonName = /^Editar a Carlos/;
const motherSurnames = ['López', 'Rojas', 'Vargas', 'Quispe', 'Mamani', 'Flores'];

const openEditForm = async (page) => {
  await page.goto('/dashboard/administrador/usuarios');
  await page.getByPlaceholder('Buscar usuarios...').fill(editedUser);
  await page.getByRole('button', {name: editButtonName}).first().click();
  await expect(page.getByText('Editar Usuario')).toBeVisible();
};

const saveForm = async (page) => {
  await page.getByRole('button', {name: 'Actualizar'}).click();
  await expect(page.getByText('Editar Usuario')).toBeHidden();
};

test('el administrador edita la dependencia y el apellido materno y los datos quedan guardados', async ({page}) => {
  const dependency = String(100 + Math.floor(Math.random() * 900));
  const motherSurname = motherSurnames[Number(dependency) % motherSurnames.length];
  await loginInBrowser(page, 'admin.prueba');
  await openEditForm(page);
  await page.getByPlaceholder('López').fill(motherSurname);
  await page.getByPlaceholder('Ej: 421').fill(dependency);
  await saveForm(page);

  await page.reload();
  await openEditForm(page);
  await expect(page.getByPlaceholder('López')).toHaveValue(motherSurname);
  await expect(page.getByPlaceholder('Ej: 421')).toHaveValue(dependency);

  await saveForm(page);
  const admin = await apiClient('admin.prueba');
  const users = await admin.get('/user/all');
  const carlos = users.find((user) => user.email_corporativo === 'carlos.empleado@maxam.com');
  expect(carlos.codigo_dependencia).toBe(dependency);
  expect(carlos.apellido_materno).toBe(motherSurname);
});

test('el menú del administrador entra completo sin barra de desplazamiento @celular', async ({page}) => {
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/usuarios');
  await page.getByRole('button', {name: 'Abrir menú'}).click();
  const nav = page.getByRole('navigation', {name: 'Menú principal'});
  await expect(nav.getByRole('link', {name: 'Usuarios'})).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', {name: 'Cerrar Sesión'})).toBeVisible();
  const overflow = await nav.evaluate((element) => element.parentElement.scrollHeight - element.parentElement.clientHeight);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('en un celular de pantalla baja el menú del aprobador muestra Cerrar Sesión sin mover la página @celular', async ({page}) => {
  await page.setViewportSize({width: 360, height: 560});
  await loginInBrowser(page, 'pedro.aprobador');
  await page.getByRole('button', {name: 'Abrir menú'}).click();
  const logout = page.getByRole('button', {name: 'Cerrar Sesión'});
  await expect(logout).toBeInViewport({ratio: 1});
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  expect(bodyOverflow).toBe('hidden');
});
