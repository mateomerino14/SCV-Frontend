import {COLORS} from '../../../constants';

const formulas = {
  S: {divisor: '0.84', taxes: 'El RC-IVA (13%) y el IT (3%)'},
  C: {divisor: '0.92', taxes: 'El IUE (5%) y el IT (3%)'},
};

function WithholdingFormulaNote({type}) {
  const formula = formulas[type];
  if (!formula) {
    return null;
  }
  return (
    <p className="text-[11px] font-inter leading-snug mt-2" style={{color: COLORS.labels}}>
      La empresa asume los impuestos: {formula.taxes} se calculan sobre el monto pagado ÷ {formula.divisor}, y el importe costo es el monto pagado + las retenciones.
    </p>
  );
}

export default WithholdingFormulaNote;
