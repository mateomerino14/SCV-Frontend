import {test, expect} from '@playwright/test';
import {loginInBrowser, testPassword, apiClient, boliviaDate} from './support/helpers';

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

test('sin sesión, una ruta privada escrita a mano lleva al inicio de sesión', async ({page}) => {
  for (const path of ['/dashboard/empleado', '/dashboard/administrador/vehiculos', '/dashboard/aprobador/revisiones', '/dashboard/tesorero/revisiones']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/$/);
  }
});

test('cada rol que escribe la ruta de otro vuelve a su propia pantalla', async ({page}) => {
  await loginInBrowser(page, 'juan.empleado');
  for (const path of ['/dashboard/aprobador/revisiones', '/dashboard/revisor', '/dashboard/supervisor/viajes-historial', '/dashboard/tesorero/revisiones', '/dashboard/administrador/vehiculos']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/dashboard\/empleado$/);
  }
});

test('un viaje ajeno abierto por su ruta no muestra sus datos', async ({page}) => {
  const owner = await apiClient('juan.empleado');
  const trip = await owner.post('/trip', {motivo: `Viaje privado ${Date.now()}`, origen: 'La Paz', destino: 'Oruro', fecha_inicio: boliviaDate(3), fecha_fin: boliviaDate(4), tipo: 'Nacional', transporte: 'Terrestre', monto_asignado: 600});
  await loginInBrowser(page, 'carlos.empleado');
  await page.goto(`/dashboard/empleado/viaje/${trip.id_viaje}`);
  await expect(page.getByText(trip.motivo)).toHaveCount(0);
});
