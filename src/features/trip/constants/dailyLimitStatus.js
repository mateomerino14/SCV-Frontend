import {CheckCircle2, AlertTriangle, XCircle, ShieldCheck} from 'lucide-react';

export const nearLimitRatio = 0.8;

export const dailyLimitStatus = {
  OK: {label: 'Dentro del límite', color: '#2d7a3a', bg: '#e3f2e6', icon: CheckCircle2},
  NEAR: {label: 'Cerca del límite', color: '#A45718', bg: '#fbefe2', icon: AlertTriangle},
  EXCEEDED: {label: 'Excedido', color: '#D20F12', bg: '#fde9e9', icon: XCircle},
  JUSTIFIED: {label: 'Excedido · Justificado', color: '#500203', bg: '#F1F2FF', icon: ShieldCheck},
};

export const getLimitStatus = (amount, limit) => {
  if (limit > 0 && amount > limit) {
    return 'EXCEEDED';
  }
  if (limit > 0 && amount >= limit * nearLimitRatio) {
    return 'NEAR';
  }
  return 'OK';
};

export const describeDayExcess = (day, dailyRate, dailyRateUsd) => {
  const parts = [];
  if (day.excedeBs) {
    parts.push(`${day.montoBs.toFixed(2)} Bs (límite ${dailyRate.toFixed(2)})`);
  }
  if (day.excedeUsd) {
    parts.push(`${day.montoUsd.toFixed(2)} USD (límite ${dailyRateUsd.toFixed(2)})`);
  }
  return parts.join(' y ');
};
