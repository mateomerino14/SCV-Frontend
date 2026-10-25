import {test, expect} from '@playwright/test';
import ExcelJS from 'exceljs';
import {loginInBrowser, apiClient} from './support/helpers';

const bossEmail = 'rosa.excel@maxam.com';
const employeeEmail = 'luis.excel@maxam.com';

const buildFile = async (path) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('USUARIOS');
  sheet.addRow(['Nombre *', 'Apellido paterno *', 'Correo corporativo *', 'Cargo *', 'Sección', 'Rol', 'Correo del jefe directo']);
  sheet.addRow(['Rosa', 'Excel', bossEmail, 'Jefe de Area de Prueba', 'Ventas', 'SUPERVISOR', '']);
  sheet.addRow(['Luis', 'Excel', employeeEmail, 'Analista de Prueba', 'Ventas', '', bossEmail]);
  sheet.addRow(['Juan', 'Repetido', 'juan.empleado@maxam.com', 'Analista de Prueba', '', '', '']);
  await workbook.xlsx.writeFile(path);
};

const removeImported = async () => {
  const admin = await apiClient('admin.prueba');
  const users = await admin.get('/user/all');
  const imported = users.filter((user) => [employeeEmail, bossEmail].includes(user.email_corporativo));
  imported.sort((first) => (first.email_corporativo === employeeEmail ? -1 : 1));
  for (const user of imported) {
    await admin.del(`/user/${user.id_usuario}`);
  }
};

test('el administrador importa usuarios desde Excel y ve las filas con errores', async ({page}, testInfo) => {
  await removeImported();
  const filePath = testInfo.outputPath('usuarios.xlsx');
  await buildFile(filePath);
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/usuarios');
  await page.getByRole('button', {name: 'Importar desde Excel'}).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Descargar plantilla'}).click();
  expect((await download).suggestedFilename()).toMatch(/^PLANTILLA_USUARIOS_/);
  await page.locator('input[type=file][accept*=".xlsx"]').setInputFiles(filePath);
  await expect(page.getByText('2 listas para crear')).toBeVisible();
  await expect(page.getByText('1 con errores')).toBeVisible();
  await expect(page.getByText('Ya existe un usuario con ese correo en el sistema')).toBeVisible();
  await page.getByRole('button', {name: 'Crear 2 usuarios'}).click();
  await expect(page.getByText('Se crearon 2 usuarios')).toBeVisible();
  await page.getByRole('button', {name: 'Cerrar'}).click();
  await expect(page.getByText('Luis Excel')).toBeVisible();
  await removeImported();
});
