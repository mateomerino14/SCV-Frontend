import InvoiceImagePreview from './InvoiceImagePreview';

export default {
  title: 'Expense/Atoms/InvoiceImagePreview',
  component: InvoiceImagePreview,
  parameters: {
    docs: {
      description: {
        component: 'Vista previa de la factura escaneada con el proveedor, el total y la fecha detectados.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    invoice: {
      preview: 'https://placehold.co/600x800?text=Factura',
      data: {proveedor: 'Hotel Los Tajibos', monto: '450.00', iva: '0', fecha_emision: '15/09/2026'},
    },
  },
};

export const Default = {};
