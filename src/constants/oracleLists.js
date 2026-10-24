export const oracleDefaults = {
  company: '76',
  businessUnit: '8',
  dependency: '900',
  subaccount: '000000',
  section: '000',
  product: '000',
  complement: '000',
  liabilityAccount: '466100',
  liabilityDescription: 'BOL.INT\\. .SEDE.PROVEEDORES - EMPLEADOS.0.0.0.0',
  invoiceBatch: '900',
  context: 'Factura Estándar',
  controlCode: '0',
  bolInvoiceType: '1',
  invoiceType: 'Estándar',
  functionalCurrency: 'BOB',
  paymentMethod: 'Cheque',
  calculationLevel: 'Línea',
  documentCategory: 'Facturas estándar',
  documentSequence: 'AP.F.BOL',
  supplierSuffix: '(BOL)',
  lineStatus: 'Validadas',
};

export const oracleTaxCodes = {
  invoiceVat: '13-IVA',
  employeeNoVat: 'EMP-SIN-IVA',
};

export const oracleTaxLines = {
  '13-IVA': {account: '472000', description: 'IVA CREDITO FISCAL'},
  'EMP-SIN-IVA': {account: '472000', description: 'BOL Liquidacion Gastos Empleados'},
};

export const oracleWithholdings = {
  S: {group: 'SERVICIOS Y ALQUILERES', mainCode: '13 RCIVA RET', mainAccount: '475196'},
  C: {group: 'RETENCIONES COMPRAS', mainCode: '5 IUE RET', mainAccount: ''},
  it: {code: '3 IT RET', account: '475195'},
};

export const oraclePaymentTerms = {
  invoice: {terms: '0D', paymentGroup: 'M-CENTRO'},
  noInvoice: {terms: 'Contado', paymentGroup: 'TRANS-EMPLEADOS'},
};

export const oracleLists = {
  invoiceTypes: [
    'Estándar', 'A partir de Pedido', 'Anticipo', 'Confrontación Rápida', 'Facturas-Leasing', 'Gastos Devolucion',
    'Informe de Gastos', 'Nota de Abono', 'Nota de Cargo', 'Retención de Impuestos', 'Mixta',
  ],
  currencies: [
    'BOB', 'USD', 'EUR', 'ARS', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'PYG', 'UYU', 'GBP', 'CAD', 'AUD', 'CHF', 'CNY', 'JPY',
    'RSD', 'RUB', 'SAR', 'SEK', 'SGD', 'SIT', 'SKK', 'TRY', 'UAH', 'UFV', 'UZS', 'XAF', 'XOF',
  ],
  taxCodes: ['0-IVA', '13-IVA', '13-IVA POLIZAS', 'EMP-SIN-IVA', 'Exento IVA', 'I.C.E.', 'NO CF-30%', 'No IVA', 'TASA CERO', 'TASAS'],
  withholdingGroups: [
    '10 IUE RET EX', '12.5 IUE RET', '12.5 IUE RET EX', '13 IUE RET', '13 RCIVA DEP', '13 RCIVA RET', '3 IT RET', '5 IUE RET',
    'RETENCIONES COMPRAS', 'RETENCIONES SERVICIOS', 'SERVICIOS Y ALQUILERES',
  ],
  terms: ['0D', 'Contado'],
  paymentGroups: [
    'M-AUSTRALIA', 'M-BARCELONA', 'M-BIRMINGHAM', 'M-CENTRALIZADO', 'M-CENTRO', 'M-CENTRO-ANT', 'M-CENTRO-RECIBIDA', 'M-CRC',
    'M-DEU', 'M-GALDACANO', 'M-HOUSTON', 'M-IRUÑA', 'M-LERIDA', 'SVE INTERNATIONAL', 'SVE PLUSGIRO', 'TIR', 'TRANS-EMPLEADOS',
    'TRANS. EXT. URGENTE', 'TRANS. NAC. URGENTE', 'TRANSFER', 'TRANSFER - GROUP', 'TRANSFERENCIA', 'TRANSFERENCIA INT',
    'TRANSFERENCIAS', 'TRANSFERENCIAS IRUNA', 'TRANSFERENCIAS PARAMO',
  ],
  paymentMethods: ['Cheque', 'Compensación', 'Electrónico', 'Giro'],
  lineTypes: ['Artículo', 'Impuesto', 'Retención de Impuestos'],
};
