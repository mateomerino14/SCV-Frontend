import {useState} from 'react';
import BackupImagesUpload from './BackupImagesUpload';

const sampleImage = (text) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="200" height="120" fill="#eef3fb"/><text x="100" y="65" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#1b4f91">${text}</text></svg>`)}`;

export default {
  title: 'Expense/Molecules/BackupImagesUpload',
  component: BackupImagesUpload,
  parameters: {
    docs: {
      description: {
        component: 'Respaldos opcionales de un gasto sin factura (hasta 2), por ejemplo el comprobante del cambio de moneda. Muestra las miniaturas y el botón para agregar mientras haya espacio.',
      },
    },
  },
  args: {onAdd: () => {}, onRemove: () => {}},
  decorators: [(Story) => <div style={{width: 340}}><Story /></div>],
};

export const Interactive = {
  render: () => {
    const [images, setImages] = useState([]);
    const handleAdd = (file) => setImages((prev) => [...prev, {id: `${Date.now()}`, preview: URL.createObjectURL(file)}]);
    const handleRemove = (id) => setImages((prev) => prev.filter((image) => image.id !== id));
    return <BackupImagesUpload images={images} onAdd={handleAdd} onRemove={handleRemove} />;
  },
};

export const OneBackup = {
  args: {images: [{id: 'r1', preview: sampleImage('Cambio de moneda')}]},
};

export const Full = {
  args: {images: [{id: 'r1', preview: sampleImage('Cambio de moneda')}, {id: 'r2', preview: sampleImage('Boleta del banco')}]},
};

export const ReadOnly = {
  args: {images: [{id: 'r1', preview: sampleImage('Cambio de moneda')}], disabled: true},
};
