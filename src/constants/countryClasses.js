// Clase 1: Europa, Asia, África y Norte América. Clase 2: Centro y Sud América y el Caribe
// Oceanía no figura en el reglamento: se toma como clase 1. Debe coincidir con utils/countryClasses.js del backend
export const countryRegions = [
  {region: 'Centro y Sud América y el Caribe', clase: 2, paises: ['Argentina', 'Bahamas', 'Barbados', 'Belice', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Guatemala', 'Guyana', 'Haití', 'Honduras', 'Jamaica', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Surinam', 'Trinidad y Tobago', 'Uruguay', 'Venezuela']},
  {region: 'Norte América', clase: 1, paises: ['Canadá', 'Estados Unidos', 'México']},
  {region: 'Europa', clase: 1, paises: ['Alemania', 'Austria', 'Bélgica', 'Bulgaria', 'Croacia', 'Dinamarca', 'Eslovaquia', 'Eslovenia', 'España', 'Estonia', 'Finlandia', 'Francia', 'Grecia', 'Hungría', 'Irlanda', 'Islandia', 'Italia', 'Letonia', 'Lituania', 'Luxemburgo', 'Noruega', 'Países Bajos', 'Polonia', 'Portugal', 'Reino Unido', 'República Checa', 'Rumania', 'Rusia', 'Serbia', 'Suecia', 'Suiza', 'Turquía', 'Ucrania']},
  {region: 'Asia', clase: 1, paises: ['Arabia Saudita', 'China', 'Corea del Sur', 'Emiratos Árabes Unidos', 'Filipinas', 'India', 'Indonesia', 'Israel', 'Japón', 'Kazajistán', 'Malasia', 'Mongolia', 'Pakistán', 'Qatar', 'Singapur', 'Tailandia', 'Taiwán', 'Uzbekistán', 'Vietnam']},
  {region: 'África', clase: 1, paises: ['Angola', 'Argelia', 'Botsuana', 'Burkina Faso', 'Costa de Marfil', 'Egipto', 'Etiopía', 'Ghana', 'Guinea', 'Kenia', 'Mali', 'Marruecos', 'Mozambique', 'Namibia', 'Nigeria', 'República Democrática del Congo', 'Senegal', 'Sudáfrica', 'Tanzania', 'Zambia', 'Zimbabue']},
  {region: 'Oceanía', clase: 1, paises: ['Australia', 'Nueva Zelanda']},
];

const countryClasses = new Map(countryRegions.flatMap((region) => region.paises.map((country) => [country, region.clase])));

export const countryClassOf = (country) => countryClasses.get(country) || null;
