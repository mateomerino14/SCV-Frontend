import {COLORS} from '../../../constants';

const taxes = {
  S: 'El RC-IVA (13%) y el IT (3%)',
  C: 'El IUE (5%) y el IT (3%)',
};

function WithholdingFormulaNote({type}) {
  if (!taxes[type]) {
    return null;
  }
  return (
    <p className="text-[11px] font-inter leading-snug mt-2" style={{color: COLORS.labels}}>
      {taxes[type]} se calculan sobre el total del documento; al proveedor se le cancela el total menos las retenciones.
    </p>
  );
}

export default WithholdingFormulaNote;
