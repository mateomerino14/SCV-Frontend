import {COLORS} from '../../../constants';

const formulas = {
  S: {divisor: '0.84', rates: '100% − 13% − 3%', taxes: 'El RC-IVA (13%) y el IT (3%)'},
  C: {divisor: '0.92', rates: '100% − 5% − 3%', taxes: 'El IUE (5%) y el IT (3%)'},
};

function WithholdingFormulaNote({type}) {
  const formula = formulas[type];
  if (!formula) {
    return null;
  }
  return (
    <p className="text-[11px] font-inter leading-snug mt-2" style={{color: COLORS.labels}}>
      La empresa asume los impuestos: base imponible = monto pagado ÷ {formula.divisor} ({formula.rates}). {formula.taxes} se calculan sobre esa base, no sobre el monto pagado; por eso monto pagado + retenciones = base imponible.
    </p>
  );
}

export default WithholdingFormulaNote;
