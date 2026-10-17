import {useState} from 'react';
import InvoiceForm from './InvoiceForm';

const categories = [{id_categoria: 1, nombre: 'Alimentación'}, {id_categoria: 2, nombre: 'Combustible'}];

const baseData = {proveedor: 'Surtidor El Alto', numero_factura: 'BOL-$153@42', nit: '1020304', fecha_emision: '2026-10-14', monto: '100.00', iva: '13.00', monto_total: '113.00',
  tipo_doc: 'F', id_categoria_gasto: 2, detalle: []};

export default {
  title: 'Expense/Organisms/InvoiceForm',
  component: InvoiceForm,
  parameters: {
    docs: {
      description: {
        component: 'Formulario de una factura escaneada. Se escribe el total que figura en el papel: con Factura (F) el IVA del 13% ya está incluido y se separa por dentro (subtotal + IVA = total); con Recibo (R) no hay IVA. Al cambiar de tipo se conserva el total. El número admite códigos con símbolos (@, $, #) de recibos y boletos. Al registrar la fecha de emisión se puede corregir; al modificar (lockDate) queda bloqueada.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 380}}><Story /></div>],
};

function InteractiveForm({initialData, lockDate}) {
  const [data, setData] = useState(initialData);
  return <InvoiceForm data={data} categories={categories} lockDate={lockDate} onChange={(field, value) => setData((prev) => ({...prev, [field]: value}))} />;
}

export const RegisterInvoice = {
  render: () => <InteractiveForm initialData={baseData} />,
};

export const RegisterReceipt = {
  render: () => <InteractiveForm initialData={{...baseData, tipo_doc: 'R', iva: '0.00', monto_total: '100.00'}} />,
};

export const EditWithLockedDate = {
  render: () => <InteractiveForm initialData={baseData} lockDate />,
};
