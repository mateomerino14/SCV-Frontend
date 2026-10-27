import {test, expect} from '@playwright/test';
import {loginInBrowser, createFundedTrip} from './support/helpers';

const slowScanMs = {A: 2500, B: 1200, C: 1200};
const photoBytes = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAIAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDqaKKKAP/Z', 'base64');

const photo = (name) => ({name: `factura_${name}.jpg`, mimeType: 'image/jpeg', buffer: photoBytes});

test('las fotos que se agregan mientras otra se escanea reciben sus propios datos @celular', async ({page}) => {
  const {tripId} = await createFundedTrip();
  await page.route('**/invoice/extract', async (route) => {
    const name = route.request().postDataBuffer().toString('latin1').match(/filename="factura_([A-C])/)[1];
    await new Promise((resolve) => setTimeout(resolve, slowScanMs[name]));
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({proveedor: `Proveedor ${name}`, numero_factura: `N-${name}`, nit: '123', fecha_emision: '2026-10-27', monto: 87, iva: 13, monto_total: 100, tipo_doc: 'F', detalle: []}),
    });
  });
  await loginInBrowser(page, 'juan.empleado');
  await page.goto(`/dashboard/empleado/viaje/${tripId}/subir-factura`);
  const input = page.locator('input[type=file][accept="image/*,application/pdf"]');
  await input.setInputFiles([photo('A')]);
  await expect(page.getByText('factura_A.jpg')).toBeVisible();
  await input.setInputFiles([photo('B'), photo('C')]);
  for (const name of ['A', 'B', 'C']) {
    await expect(page.getByText(`Proveedor ${name} — 100.00 Bs`).first()).toBeVisible();
  }
  await expect(page.getByText('Procesando...')).toHaveCount(0);
  await expect(page.getByRole('button', {name: 'Guardar 3 facturas'})).toBeVisible();
});
