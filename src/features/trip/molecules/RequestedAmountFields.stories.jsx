import RequestedAmountFields from './RequestedAmountFields';
import useRequestedAmounts from '../../../hooks/trip/useRequestedAmounts';

export default {
  title: 'Trip/Molecules/RequestedAmountFields',
  component: RequestedAmountFields,
  parameters: {
    docs: {
      description: {
        component: 'Monto que solicita el empleado al registrar el viaje: hospedaje estimado, referencia (días × tarifa diaria) y tope por moneda.',
      },
    },
  },
};

function Template({type}) {
  const days = 4;
  const dailyRate = 300;
  const dailyRateUsd = 40;
  const requested = useRequestedAmounts({type, days, dailyRate, dailyRateUsd});
  return (
    <div style={{width: 560, maxWidth: '100vw'}}>
      <RequestedAmountFields {...requested} days={days} dailyRate={dailyRate} dailyRateUsd={dailyRateUsd}
        onAmountChange={requested.handleAmountChange} onFillWithLimits={requested.fillWithLimits} />
    </div>
  );
}

export const National = {
  render: () => <Template type="Nacional" />,
};

export const International = {
  render: () => <Template type="Internacional" />,
};
