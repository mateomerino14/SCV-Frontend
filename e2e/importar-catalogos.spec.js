import {test, expect} from '@playwright/test';
import os from 'os';
import path from 'path';
import ExcelJS from 'exceljs';
import {loginInBrowser, apiClient} from './support/helpers';

const positionName = 'Cargo Importado E2E';
const sectionName = 'SECCIÓN IMPORTADA E2E';

const asciiPath = (name) => path.join(os.tmpdir(), `${Date.now()}-${name}`);

const writeFile = async (filePath, sheetName, rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  rows.forEach((row) => sheet.addRow(row));
  await workbook.xlsx.writeFile(filePath);
};

const removeImported = async () => {
  const admin = await apiClient('admin.prueba');
  const positions = await admin.get('/position');
  const position = positions.find((item) => item.nombre === positionName);
  if (position) {
    await admin.del(`/position/${position.id_cargo}`);
  }
  const sections = await admin.get('/section');
  const section = sections.find((item) => item.nombre === sectionName);
  if (section) {
    await admin.del(`/section/${section.id_seccion}`);
  }
};

const freeSectionCode = async () => {
  const admin = await apiClient('admin.prueba');
  const used = new Set((await admin.get('/section')).map((section) => section.codigo_seccion));
  return String(Array.from({length: 900}, (_, index) => index + 100).find((value) => !used.has(String(value))));
};

test('el administrador importa cargos con su tipo de viático y ve la escala', async ({page}) => {
  await removeImported();
  const filePath = asciiPath('cargos.xlsx');
  await writeFile(filePath, 'CARGOS', [
    ['Cargo *', 'Tipo de viático *', 'Estado'],
    [positionName, 'B', 'Activo'],
    ['Analista de Prueba', 'A', ''],
    ['Cargo sin tipo', '', ''],
  ]);
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/cargos');
  await expect(page.getByText('Escala de Viáticos', {exact: true})).toBeVisible();
  await expect(page.getByText('Gerente General y Gerentes de Área')).toBeVisible();
  await page.getByRole('button', {name: 'Importar desde Excel'}).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Descargar plantilla'}).click();
  expect((await download).suggestedFilename()).toMatch(/^PLANTILLA_CARGOS_/);
  await page.locator('input[type=file][accept*=".xlsx"]').setInputFiles(filePath);
  await expect(page.getByText('2 filas correctas')).toBeVisible();
  await expect(page.getByText('1 con errores')).toBeVisible();
  await expect(page.getByText('El tipo de viático debe ser A, B o C')).toBeVisible();
  await expect(page.getByText('Sin cambios')).toBeVisible();
  await page.getByRole('button', {name: 'Guardar 1 cargo'}).click();
  await expect(page.getByText(/Se crearon 1 cargo, se actualizaron 0, 1 ya estaban igual/)).toBeVisible();
  await page.getByRole('button', {name: 'Cerrar'}).click();
  await page.getByPlaceholder('Buscar cargos...').fill(positionName);
  await expect(page.getByText(positionName)).toBeVisible();
  await expect(page.getByText('Tipo B')).toBeVisible();
  await removeImported();
});

test('el administrador importa secciones por su código de Oracle', async ({page}) => {
  await removeImported();
  const code = await freeSectionCode();
  const filePath = asciiPath('secciones.xlsx');
  await writeFile(filePath, 'SECCIONES', [
    ['Sección Oracle *', 'Sección *', 'Estado'],
    [code, sectionName, ''],
    ['12', 'Código corto', ''],
  ]);
  await loginInBrowser(page, 'admin.prueba');
  await page.goto('/dashboard/administrador/secciones');
  await page.getByRole('button', {name: 'Importar desde Excel'}).click();
  await page.locator('input[type=file][accept*=".xlsx"]').setInputFiles(filePath);
  await expect(page.getByText('La sección de Oracle debe tener 3 dígitos')).toBeVisible();
  await page.getByRole('button', {name: 'Guardar 1 sección'}).click();
  await expect(page.getByText(/Se crearon 1 sección/)).toBeVisible();
  await page.getByRole('button', {name: 'Cerrar'}).click();
  await page.getByPlaceholder('Buscar secciones...').fill('IMPORTADA E2E');
  await expect(page.getByText(sectionName)).toBeVisible();
  await removeImported();
});
