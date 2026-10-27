import {test, expect} from '@playwright/test';
import {loginInBrowser, testPassword} from './support/helpers';

const roleHomes = [
  ['juan.empleado', '/dashboard/empleado'],
  ['maria.supervisora', '/dashboard/supervisor/viajes-pendientes'],
  ['pedro.aprobador', '/dashboard/aprobador/revisiones'],
  ['lucia.revisora', '/dashboard/revisor'],
  ['admin.prueba', '/dashboard/administrador'],
];

for (const [user, home] of roleHomes) {
  test(`${user} entra a su pantalla de inicio @celular`, async ({page}) => {
    await loginInBrowser(page, user);
    await expect(page).toHaveURL(new RegExp(`${home}$`));
  });
}

test('una contraseña incorrecta muestra un aviso sin revelar la cuenta', async ({page}) => {
  await page.goto('/');
  await page.locator('input[type=email]:visible').fill('juan.empleado@maxam.com');
  await page.locator('input[type=password]:visible').fill(`${testPassword}x`);
  await page.getByRole('button', {name: 'Iniciar Sesión'}).first().click();
  await expect(page.getByText('El correo o la contraseña son incorrectos').locator('visible=true')).toBeVisible();
  await expect(page).not.toHaveURL(/\/dashboard\//);
});

test('un empleado no puede abrir pantallas del administrador', async ({page}) => {
  await loginInBrowser(page, 'juan.empleado');
  await page.goto('/dashboard/administrador/usuarios');
  await expect(page).toHaveURL(/\/dashboard\/empleado$/);
});
