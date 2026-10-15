import {useState} from 'react';
import InvoiceDetailPanel from './InvoiceDetailPanel';

const sampleDetail = [{nombre_producto: 'Gasolina especial', cantidad: 53.34, precio: 3.74}, {nombre_producto: 'Naranja', cantidad: 6, precio: 1.5}];

export default {
  title: 'Expense/Organisms/InvoiceDetailPanel',
  component: InvoiceDetailPanel,
  parameters: {
    docs: {
      description: {
        component: 'Tabla de productos o servicios de la factura. La cantidad admite hasta 2 decimales (por ejemplo litros de combustible) o enteros para unidades.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 380}}><Story /></div>],
};

export const Interactive = {
  render: () => {
    const [detail, setDetail] = useState(sampleDetail);
    return <InvoiceDetailPanel detail={detail} onAdd={(item) => setDetail((prev) => [...prev, item])} onRemove={(index) => setDetail((prev) => prev.filter((_, current) => current !== index))} />;
  },
};

export const Saved = {
  args: {detail: sampleDetail, onAdd: () => {}, onRemove: () => {}, saved: true},
};

export const WithError = {
  args: {detail: [], onAdd: () => {}, onRemove: () => {}, error: 'Debes agregar al menos un producto al detalle'},
};
