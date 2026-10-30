import SignerRow from './SignerRow';

export default {
  title: 'Document/Molecules/SignerRow',
  component: SignerRow,
  parameters: {
    docs: {
      description: {
        component: 'Persona que firmó un documento, como se muestra en la página pública de verificación: etapa, nombre, cargo y fecha (sin mostrar el trazo).',
      },
    },
  },
};

export const Firmado = {
  args: {signer: {etapa: 'Autorizó el viaje', nombre: 'Ricardo Salinas Paredes', cargo: 'Gerente General', fecha: '2026-10-29T23:07:00Z', automatica: false}},
};

export const Automatico = {
  args: {signer: {etapa: 'Vo/ Bo Gerente de Área', nombre: 'Ricardo Salinas Paredes', cargo: 'Gerente General', fecha: '2026-10-29T23:07:00Z', automatica: true}},
};
