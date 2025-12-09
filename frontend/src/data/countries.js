/**
 * Lista completa de paises com codigos de telefone internacional
 * Padrao E.164: +[codigo pais][numero nacional] (max 15 digitos)
 *
 * Campos:
 * - code: ISO 3166-1 alpha-2
 * - name: Nome em portugues
 * - dial: Codigo de discagem (DDI)
 * - flag: Emoji da bandeira
 * - digits: { min, max } digitos do numero nacional
 * - mobileStart: Prefixos de celular (null = qualquer)
 */

export const countries = [
  // AMERICA DO SUL (Prioridade Alta)
  { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷', digits: { min: 10, max: 11 }, mobileStart: ['9'] },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷', digits: { min: 10, max: 10 }, mobileStart: ['9'] },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴', digits: { min: 10, max: 10 }, mobileStart: ['3'] },
  { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪', digits: { min: 10, max: 10 }, mobileStart: ['4'] },
  { code: 'EC', name: 'Equador', dial: '+593', flag: '🇪🇨', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴', digits: { min: 8, max: 8 }, mobileStart: ['6', '7'] },
  { code: 'PY', name: 'Paraguai', dial: '+595', flag: '🇵🇾', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'UY', name: 'Uruguai', dial: '+598', flag: '🇺🇾', digits: { min: 8, max: 8 }, mobileStart: ['9'] },
  { code: 'GY', name: 'Guiana', dial: '+592', flag: '🇬🇾', digits: { min: 7, max: 7 }, mobileStart: ['6'] },
  { code: 'SR', name: 'Suriname', dial: '+597', flag: '🇸🇷', digits: { min: 7, max: 7 }, mobileStart: ['8'] },
  { code: 'GF', name: 'Guiana Francesa', dial: '+594', flag: '🇬🇫', digits: { min: 9, max: 9 }, mobileStart: ['6'] },

  // AMERICA DO NORTE E CENTRAL
  { code: 'US', name: 'Estados Unidos', dial: '+1', flag: '🇺🇸', digits: { min: 10, max: 10 }, mobileStart: null },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', digits: { min: 10, max: 10 }, mobileStart: null },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽', digits: { min: 10, max: 10 }, mobileStart: ['1'] },
  { code: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹', digits: { min: 8, max: 8 }, mobileStart: ['3', '4', '5'] },
  { code: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳', digits: { min: 8, max: 8 }, mobileStart: ['3', '8', '9'] },
  { code: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻', digits: { min: 8, max: 8 }, mobileStart: ['6', '7'] },
  { code: 'NI', name: 'Nicaragua', dial: '+505', flag: '🇳🇮', digits: { min: 8, max: 8 }, mobileStart: ['8'] },
  { code: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷', digits: { min: 8, max: 8 }, mobileStart: ['6', '7', '8'] },
  { code: 'PA', name: 'Panama', dial: '+507', flag: '🇵🇦', digits: { min: 8, max: 8 }, mobileStart: ['6'] },
  { code: 'CU', name: 'Cuba', dial: '+53', flag: '🇨🇺', digits: { min: 8, max: 8 }, mobileStart: ['5'] },
  { code: 'DO', name: 'Republica Dominicana', dial: '+1', flag: '🇩🇴', digits: { min: 10, max: 10 }, mobileStart: ['809', '829', '849'] },
  { code: 'HT', name: 'Haiti', dial: '+509', flag: '🇭🇹', digits: { min: 8, max: 8 }, mobileStart: ['3', '4'] },
  { code: 'JM', name: 'Jamaica', dial: '+1', flag: '🇯🇲', digits: { min: 10, max: 10 }, mobileStart: ['876'] },
  { code: 'PR', name: 'Porto Rico', dial: '+1', flag: '🇵🇷', digits: { min: 10, max: 10 }, mobileStart: ['787', '939'] },
  { code: 'TT', name: 'Trinidad e Tobago', dial: '+1', flag: '🇹🇹', digits: { min: 10, max: 10 }, mobileStart: ['868'] },
  { code: 'BS', name: 'Bahamas', dial: '+1', flag: '🇧🇸', digits: { min: 10, max: 10 }, mobileStart: ['242'] },
  { code: 'BB', name: 'Barbados', dial: '+1', flag: '🇧🇧', digits: { min: 10, max: 10 }, mobileStart: ['246'] },
  { code: 'BZ', name: 'Belize', dial: '+501', flag: '🇧🇿', digits: { min: 7, max: 7 }, mobileStart: ['6'] },

  // EUROPA OCIDENTAL
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'ES', name: 'Espanha', dial: '+34', flag: '🇪🇸', digits: { min: 9, max: 9 }, mobileStart: ['6', '7'] },
  { code: 'FR', name: 'Franca', dial: '+33', flag: '🇫🇷', digits: { min: 9, max: 9 }, mobileStart: ['6', '7'] },
  { code: 'IT', name: 'Italia', dial: '+39', flag: '🇮🇹', digits: { min: 10, max: 10 }, mobileStart: ['3'] },
  { code: 'DE', name: 'Alemanha', dial: '+49', flag: '🇩🇪', digits: { min: 10, max: 11 }, mobileStart: ['15', '16', '17'] },
  { code: 'GB', name: 'Reino Unido', dial: '+44', flag: '🇬🇧', digits: { min: 10, max: 10 }, mobileStart: ['7'] },
  { code: 'IE', name: 'Irlanda', dial: '+353', flag: '🇮🇪', digits: { min: 9, max: 9 }, mobileStart: ['8'] },
  { code: 'NL', name: 'Holanda', dial: '+31', flag: '🇳🇱', digits: { min: 9, max: 9 }, mobileStart: ['6'] },
  { code: 'BE', name: 'Belgica', dial: '+32', flag: '🇧🇪', digits: { min: 9, max: 9 }, mobileStart: ['4'] },
  { code: 'CH', name: 'Suica', dial: '+41', flag: '🇨🇭', digits: { min: 9, max: 9 }, mobileStart: ['7'] },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹', digits: { min: 10, max: 11 }, mobileStart: ['6'] },
  { code: 'LU', name: 'Luxemburgo', dial: '+352', flag: '🇱🇺', digits: { min: 9, max: 9 }, mobileStart: ['6'] },
  { code: 'MC', name: 'Monaco', dial: '+377', flag: '🇲🇨', digits: { min: 8, max: 8 }, mobileStart: ['6'] },
  { code: 'AD', name: 'Andorra', dial: '+376', flag: '🇦🇩', digits: { min: 6, max: 6 }, mobileStart: ['3', '6'] },

  // EUROPA NORDICA E ORIENTAL
  { code: 'SE', name: 'Suecia', dial: '+46', flag: '🇸🇪', digits: { min: 9, max: 9 }, mobileStart: ['7'] },
  { code: 'NO', name: 'Noruega', dial: '+47', flag: '🇳🇴', digits: { min: 8, max: 8 }, mobileStart: ['4', '9'] },
  { code: 'DK', name: 'Dinamarca', dial: '+45', flag: '🇩🇰', digits: { min: 8, max: 8 }, mobileStart: null },
  { code: 'FI', name: 'Finlandia', dial: '+358', flag: '🇫🇮', digits: { min: 9, max: 10 }, mobileStart: ['4', '5'] },
  { code: 'IS', name: 'Islandia', dial: '+354', flag: '🇮🇸', digits: { min: 7, max: 7 }, mobileStart: ['6', '7', '8'] },
  { code: 'PL', name: 'Polonia', dial: '+48', flag: '🇵🇱', digits: { min: 9, max: 9 }, mobileStart: ['5', '6', '7', '8'] },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺', digits: { min: 10, max: 10 }, mobileStart: ['9'] },
  { code: 'UA', name: 'Ucrania', dial: '+380', flag: '🇺🇦', digits: { min: 9, max: 9 }, mobileStart: ['5', '6', '9'] },
  { code: 'CZ', name: 'Republica Tcheca', dial: '+420', flag: '🇨🇿', digits: { min: 9, max: 9 }, mobileStart: ['6', '7'] },
  { code: 'HU', name: 'Hungria', dial: '+36', flag: '🇭🇺', digits: { min: 9, max: 9 }, mobileStart: ['2', '3', '7'] },
  { code: 'RO', name: 'Romenia', dial: '+40', flag: '🇷🇴', digits: { min: 9, max: 9 }, mobileStart: ['7'] },
  { code: 'BG', name: 'Bulgaria', dial: '+359', flag: '🇧🇬', digits: { min: 9, max: 9 }, mobileStart: ['8', '9'] },
  { code: 'GR', name: 'Grecia', dial: '+30', flag: '🇬🇷', digits: { min: 10, max: 10 }, mobileStart: ['6', '9'] },
  { code: 'TR', name: 'Turquia', dial: '+90', flag: '🇹🇷', digits: { min: 10, max: 10 }, mobileStart: ['5'] },
  { code: 'HR', name: 'Croacia', dial: '+385', flag: '🇭🇷', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'RS', name: 'Serbia', dial: '+381', flag: '🇷🇸', digits: { min: 9, max: 9 }, mobileStart: ['6'] },
  { code: 'SK', name: 'Eslovaquia', dial: '+421', flag: '🇸🇰', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'SI', name: 'Eslovenia', dial: '+386', flag: '🇸🇮', digits: { min: 8, max: 8 }, mobileStart: ['3', '4', '5', '6', '7'] },
  { code: 'EE', name: 'Estonia', dial: '+372', flag: '🇪🇪', digits: { min: 7, max: 8 }, mobileStart: ['5'] },
  { code: 'LV', name: 'Letonia', dial: '+371', flag: '🇱🇻', digits: { min: 8, max: 8 }, mobileStart: ['2'] },
  { code: 'LT', name: 'Lituania', dial: '+370', flag: '🇱🇹', digits: { min: 8, max: 8 }, mobileStart: ['6'] },
  { code: 'BY', name: 'Belarus', dial: '+375', flag: '🇧🇾', digits: { min: 9, max: 9 }, mobileStart: ['25', '29', '33', '44'] },

  // ASIA
  { code: 'JP', name: 'Japao', dial: '+81', flag: '🇯🇵', digits: { min: 10, max: 10 }, mobileStart: ['70', '80', '90'] },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳', digits: { min: 11, max: 11 }, mobileStart: ['1'] },
  { code: 'KR', name: 'Coreia do Sul', dial: '+82', flag: '🇰🇷', digits: { min: 10, max: 10 }, mobileStart: ['1'] },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', digits: { min: 10, max: 10 }, mobileStart: ['6', '7', '8', '9'] },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩', digits: { min: 10, max: 12 }, mobileStart: ['8'] },
  { code: 'TH', name: 'Tailandia', dial: '+66', flag: '🇹🇭', digits: { min: 9, max: 9 }, mobileStart: ['8', '9'] },
  { code: 'VN', name: 'Vietna', dial: '+84', flag: '🇻🇳', digits: { min: 9, max: 10 }, mobileStart: ['3', '5', '7', '8', '9'] },
  { code: 'PH', name: 'Filipinas', dial: '+63', flag: '🇵🇭', digits: { min: 10, max: 10 }, mobileStart: ['9'] },
  { code: 'MY', name: 'Malasia', dial: '+60', flag: '🇲🇾', digits: { min: 9, max: 10 }, mobileStart: ['1'] },
  { code: 'SG', name: 'Singapura', dial: '+65', flag: '🇸🇬', digits: { min: 8, max: 8 }, mobileStart: ['8', '9'] },
  { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰', digits: { min: 8, max: 8 }, mobileStart: ['5', '6', '9'] },
  { code: 'TW', name: 'Taiwan', dial: '+886', flag: '🇹🇼', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'PK', name: 'Paquistao', dial: '+92', flag: '🇵🇰', digits: { min: 10, max: 10 }, mobileStart: ['3'] },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩', digits: { min: 10, max: 10 }, mobileStart: ['1'] },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰', digits: { min: 9, max: 9 }, mobileStart: ['7'] },
  { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵', digits: { min: 10, max: 10 }, mobileStart: ['98'] },
  { code: 'KZ', name: 'Cazaquistao', dial: '+7', flag: '🇰🇿', digits: { min: 10, max: 10 }, mobileStart: ['7'] },

  // ORIENTE MEDIO
  { code: 'AE', name: 'Emirados Arabes', dial: '+971', flag: '🇦🇪', digits: { min: 9, max: 9 }, mobileStart: ['5'] },
  { code: 'SA', name: 'Arabia Saudita', dial: '+966', flag: '🇸🇦', digits: { min: 9, max: 9 }, mobileStart: ['5'] },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱', digits: { min: 9, max: 9 }, mobileStart: ['5'] },
  { code: 'LB', name: 'Libano', dial: '+961', flag: '🇱🇧', digits: { min: 8, max: 8 }, mobileStart: ['3', '7'] },
  { code: 'JO', name: 'Jordania', dial: '+962', flag: '🇯🇴', digits: { min: 9, max: 9 }, mobileStart: ['7'] },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼', digits: { min: 8, max: 8 }, mobileStart: ['5', '6', '9'] },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦', digits: { min: 8, max: 8 }, mobileStart: ['3', '5', '6', '7'] },
  { code: 'BH', name: 'Bahrein', dial: '+973', flag: '🇧🇭', digits: { min: 8, max: 8 }, mobileStart: ['3'] },
  { code: 'OM', name: 'Oma', dial: '+968', flag: '🇴🇲', digits: { min: 8, max: 8 }, mobileStart: ['9'] },
  { code: 'IQ', name: 'Iraque', dial: '+964', flag: '🇮🇶', digits: { min: 10, max: 10 }, mobileStart: ['7'] },
  { code: 'IR', name: 'Ira', dial: '+98', flag: '🇮🇷', digits: { min: 10, max: 10 }, mobileStart: ['9'] },
  { code: 'EG', name: 'Egito', dial: '+20', flag: '🇪🇬', digits: { min: 10, max: 10 }, mobileStart: ['1'] },

  // AFRICA
  { code: 'ZA', name: 'Africa do Sul', dial: '+27', flag: '🇿🇦', digits: { min: 9, max: 9 }, mobileStart: ['6', '7', '8'] },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬', digits: { min: 10, max: 10 }, mobileStart: ['7', '8', '9'] },
  { code: 'KE', name: 'Quenia', dial: '+254', flag: '🇰🇪', digits: { min: 9, max: 9 }, mobileStart: ['7'] },
  { code: 'GH', name: 'Gana', dial: '+233', flag: '🇬🇭', digits: { min: 9, max: 9 }, mobileStart: ['2', '5'] },
  { code: 'MA', name: 'Marrocos', dial: '+212', flag: '🇲🇦', digits: { min: 9, max: 9 }, mobileStart: ['6', '7'] },
  { code: 'DZ', name: 'Argelia', dial: '+213', flag: '🇩🇿', digits: { min: 9, max: 9 }, mobileStart: ['5', '6', '7'] },
  { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳', digits: { min: 8, max: 8 }, mobileStart: ['2', '4', '5', '9'] },
  { code: 'ET', name: 'Etiopia', dial: '+251', flag: '🇪🇹', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿', digits: { min: 9, max: 9 }, mobileStart: ['6', '7'] },
  { code: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬', digits: { min: 9, max: 9 }, mobileStart: ['7'] },
  { code: 'AO', name: 'Angola', dial: '+244', flag: '🇦🇴', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  { code: 'MZ', name: 'Mocambique', dial: '+258', flag: '🇲🇿', digits: { min: 9, max: 9 }, mobileStart: ['8'] },
  { code: 'CV', name: 'Cabo Verde', dial: '+238', flag: '🇨🇻', digits: { min: 7, max: 7 }, mobileStart: ['9'] },
  { code: 'ST', name: 'Sao Tome e Principe', dial: '+239', flag: '🇸🇹', digits: { min: 7, max: 7 }, mobileStart: ['9'] },
  { code: 'GW', name: 'Guine-Bissau', dial: '+245', flag: '🇬🇼', digits: { min: 7, max: 7 }, mobileStart: ['9'] },

  // OCEANIA
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', digits: { min: 9, max: 9 }, mobileStart: ['4'] },
  { code: 'NZ', name: 'Nova Zelandia', dial: '+64', flag: '🇳🇿', digits: { min: 9, max: 9 }, mobileStart: ['2'] },
  { code: 'FJ', name: 'Fiji', dial: '+679', flag: '🇫🇯', digits: { min: 7, max: 7 }, mobileStart: ['7', '8', '9'] },
  { code: 'PG', name: 'Papua Nova Guine', dial: '+675', flag: '🇵🇬', digits: { min: 8, max: 8 }, mobileStart: ['7'] },
];

// Ordenar por nome para o dropdown
export const countriesSorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));

// Paises prioritarios (mostrar primeiro no dropdown)
export const priorityCountries = ['BR', 'PT', 'US', 'AR', 'CL', 'CO', 'PE', 'UY', 'PY'];

// Funcoes utilitarias
export const getCountryByCode = (code) => countries.find(c => c.code === code);

export const getCountryByDial = (dial) => countries.find(c => c.dial === dial);

export const isBrazilian = (countryCode) => countryCode === 'BR';

export const getCountriesForDropdown = () => {
  const priority = priorityCountries.map(code => getCountryByCode(code)).filter(Boolean);
  const others = countriesSorted.filter(c => !priorityCountries.includes(c.code));
  return [...priority, { divider: true }, ...others];
};

export const formatPhoneDisplay = (phone, countryCode) => {
  const country = getCountryByCode(countryCode);
  if (!country || !phone) return phone || '';

  // Remove caracteres nao numericos - garante que é string
  const phoneStr = typeof phone === 'string' ? phone : String(phone || '');
  const digits = phoneStr.replace(/\D/g, '');

  if (!digits) return '';

  // Formato brasileiro: (XX) 9XXXX-XXXX
  if (countryCode === 'BR') {
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  // Formato americano: (XXX) XXX-XXXX
  if (countryCode === 'US' || countryCode === 'CA') {
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // Formato generico com espacos a cada 3 digitos
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
};

export const toE164 = (phone, countryCode) => {
  const country = getCountryByCode(countryCode);
  if (!country || !phone) return null;

  const digits = phone.replace(/\D/g, '');
  return `${country.dial}${digits}`;
};

/**
 * Retorna placeholder com máscara visual para cada país
 * Ex: Brasil (11 dígitos) = (XX) XXXXX-XXXX
 * Ex: EUA (10 dígitos) = (XXX) XXX-XXXX
 */
export const getPhonePlaceholder = (countryCode) => {
  const country = getCountryByCode(countryCode);
  if (!country) return '';

  // Máscaras específicas por país
  const masks = {
    // Brasil: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    'BR': '(XX) XXXXX-XXXX',
    // EUA/Canadá: (XXX) XXX-XXXX
    'US': '(XXX) XXX-XXXX',
    'CA': '(XXX) XXX-XXXX',
    // Portugal: XXX XXX XXX
    'PT': 'XXX XXX XXX',
    // Argentina: (XX) XXXX-XXXX
    'AR': '(XX) XXXX-XXXX',
    // Chile: X XXXX XXXX
    'CL': 'X XXXX XXXX',
    // Colômbia: XXX XXX XXXX
    'CO': 'XXX XXX XXXX',
    // México: (XX) XXXX-XXXX
    'MX': '(XX) XXXX-XXXX',
    // Reino Unido: XXXX XXX XXX
    'GB': 'XXXX XXX XXX',
    // Alemanha: XXX XXXXXXXX
    'DE': 'XXX XXXXXXXX',
    // França: X XX XX XX XX
    'FR': 'X XX XX XX XX',
    // Itália: XXX XXX XXXX
    'IT': 'XXX XXX XXXX',
    // Espanha: XXX XX XX XX
    'ES': 'XXX XX XX XX',
    // Japão: XXX-XXXX-XXXX
    'JP': 'XXX-XXXX-XXXX',
    // Austrália: XXX XXX XXX
    'AU': 'XXX XXX XXX',
  };

  // Se tem máscara específica, usa ela
  if (masks[countryCode]) {
    return masks[countryCode];
  }

  // Máscara genérica baseada no número de dígitos
  const digits = country.digits.max;
  if (digits <= 7) return 'XXX XXXX';
  if (digits === 8) return 'XXXX XXXX';
  if (digits === 9) return 'XXX XXX XXX';
  if (digits === 10) return 'XXX XXX XXXX';
  if (digits === 11) return 'XX XXXXX XXXX';
  return 'X'.repeat(digits);
};

export default countries;
