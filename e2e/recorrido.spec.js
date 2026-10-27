import {test, expect} from '@playwright/test';
import {loginInBrowser} from './support/helpers';

const users = ['juan.empleado', 'maria.supervisora', 'pedro.aprobador', 'lucia.revisora', 'tesoro.prueba', 'admin.prueba'];
const ignoredConsole = [/favicon/, /Download the React DevTools/, /ERR_NAME_NOT_RESOLVED/, /ERR_TUNNEL_CONNECTION_FAILED/, /status of 401/];
const sessionCheckPath = '/auth/refresh';
const brokenTextPattern = /error al|no se pudo|algo salió mal/i;
const brokenValuePattern = /\bundefined\b|\bNaN\b|\[object Object\]/;

const watchProblems = (page) => {
  const problems = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !ignoredConsole.some((pattern) => pattern.test(message.text()))) {
      problems.push(`consola: ${message.text().slice(0, 160)}`);
    }
  });
  page.on('pageerror', (error) => problems.push(`excepción: ${error.message.slice(0, 160)}`));
  page.on('response', (response) => {
    const isApi = response.request().resourceType() === 'xhr' || response.request().resourceType() === 'fetch';
    if (isApi && response.status() >= 400 && !response.url().endsWith(sessionCheckPath)) {
      problems.push(`API ${response.status()} ${response.request().method()} ${new URL(response.url()).pathname}`);
    }
  });
  return problems;
};

const openMenu = async (page) => {
  const nav = page.getByRole('navigation', {name: 'Menú principal'});
  if (!(await nav.isVisible())) {
    await page.getByRole('button', {name: 'Abrir menú'}).click();
  }
  return nav;
};

for (const user of users) {
  test(`todas las pantallas del menú de ${user} cargan sin errores @celular`, async ({page}) => {
    const problems = watchProblems(page);
    await loginInBrowser(page, user);
    const labels = await (await openMenu(page)).getByRole('link').allInnerTexts();
    for (const label of labels) {
      const nav = await openMenu(page);
      await nav.getByRole('link', {name: label, exact: true}).click();
      await expect(nav).toBeHidden();
      await page.waitForLoadState('networkidle');
      const broken = [...await page.getByText(brokenTextPattern).allInnerTexts(), ...await page.getByText(brokenValuePattern).allInnerTexts()];
      if (broken.length > 0) {
        problems.push(`${label}: ${broken.map((text) => text.slice(0, 120)).join(' | ')}`);
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });
}
