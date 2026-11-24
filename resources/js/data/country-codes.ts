// A compact list of country dial codes for the phone inputs.
// `dial` is the digits after the leading "+". Longest-prefix matching is used
// when parsing an existing "+<dial><national>" string back into parts.
export type CountryCode = { iso: string; name: string; dial: string; flag: string };

export const COUNTRY_CODES: CountryCode[] = [
  { iso: 'SA', name: 'Saudi Arabia', dial: '966', flag: '🇸🇦' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '971', flag: '🇦🇪' },
  { iso: 'KW', name: 'Kuwait', dial: '965', flag: '🇰🇼' },
  { iso: 'QA', name: 'Qatar', dial: '974', flag: '🇶🇦' },
  { iso: 'BH', name: 'Bahrain', dial: '973', flag: '🇧🇭' },
  { iso: 'OM', name: 'Oman', dial: '968', flag: '🇴🇲' },
  { iso: 'JO', name: 'Jordan', dial: '962', flag: '🇯🇴' },
  { iso: 'LB', name: 'Lebanon', dial: '961', flag: '🇱🇧' },
  { iso: 'EG', name: 'Egypt', dial: '20', flag: '🇪🇬' },
  { iso: 'IQ', name: 'Iraq', dial: '964', flag: '🇮🇶' },
  { iso: 'SY', name: 'Syria', dial: '963', flag: '🇸🇾' },
  { iso: 'YE', name: 'Yemen', dial: '967', flag: '🇾🇪' },
  { iso: 'PS', name: 'Palestine', dial: '970', flag: '🇵🇸' },
  { iso: 'US', name: 'United States', dial: '1', flag: '🇺🇸' },
  { iso: 'GB', name: 'United Kingdom', dial: '44', flag: '🇬🇧' },
  { iso: 'CA', name: 'Canada', dial: '1', flag: '🇨🇦' },
  { iso: 'FR', name: 'France', dial: '33', flag: '🇫🇷' },
  { iso: 'DE', name: 'Germany', dial: '49', flag: '🇩🇪' },
  { iso: 'IT', name: 'Italy', dial: '39', flag: '🇮🇹' },
  { iso: 'ES', name: 'Spain', dial: '34', flag: '🇪🇸' },
  { iso: 'NL', name: 'Netherlands', dial: '31', flag: '🇳🇱' },
  { iso: 'BE', name: 'Belgium', dial: '32', flag: '🇧🇪' },
  { iso: 'CH', name: 'Switzerland', dial: '41', flag: '🇨🇭' },
  { iso: 'SE', name: 'Sweden', dial: '46', flag: '🇸🇪' },
  { iso: 'NO', name: 'Norway', dial: '47', flag: '🇳🇴' },
  { iso: 'DK', name: 'Denmark', dial: '45', flag: '🇩🇰' },
  { iso: 'IE', name: 'Ireland', dial: '353', flag: '🇮🇪' },
  { iso: 'PT', name: 'Portugal', dial: '351', flag: '🇵🇹' },
  { iso: 'TR', name: 'Türkiye', dial: '90', flag: '🇹🇷' },
  { iso: 'RU', name: 'Russia', dial: '7', flag: '🇷🇺' },
  { iso: 'IN', name: 'India', dial: '91', flag: '🇮🇳' },
  { iso: 'PK', name: 'Pakistan', dial: '92', flag: '🇵🇰' },
  { iso: 'BD', name: 'Bangladesh', dial: '880', flag: '🇧🇩' },
  { iso: 'CN', name: 'China', dial: '86', flag: '🇨🇳' },
  { iso: 'JP', name: 'Japan', dial: '81', flag: '🇯🇵' },
  { iso: 'KR', name: 'South Korea', dial: '82', flag: '🇰🇷' },
  { iso: 'ID', name: 'Indonesia', dial: '62', flag: '🇮🇩' },
  { iso: 'MY', name: 'Malaysia', dial: '60', flag: '🇲🇾' },
  { iso: 'SG', name: 'Singapore', dial: '65', flag: '🇸🇬' },
  { iso: 'PH', name: 'Philippines', dial: '63', flag: '🇵🇭' },
  { iso: 'TH', name: 'Thailand', dial: '66', flag: '🇹🇭' },
  { iso: 'VN', name: 'Vietnam', dial: '84', flag: '🇻🇳' },
  { iso: 'AU', name: 'Australia', dial: '61', flag: '🇦🇺' },
  { iso: 'NZ', name: 'New Zealand', dial: '64', flag: '🇳🇿' },
  { iso: 'ZA', name: 'South Africa', dial: '27', flag: '🇿🇦' },
  { iso: 'NG', name: 'Nigeria', dial: '234', flag: '🇳🇬' },
  { iso: 'KE', name: 'Kenya', dial: '254', flag: '🇰🇪' },
  { iso: 'MA', name: 'Morocco', dial: '212', flag: '🇲🇦' },
  { iso: 'DZ', name: 'Algeria', dial: '213', flag: '🇩🇿' },
  { iso: 'TN', name: 'Tunisia', dial: '216', flag: '🇹🇳' },
  { iso: 'LY', name: 'Libya', dial: '218', flag: '🇱🇾' },
  { iso: 'SD', name: 'Sudan', dial: '249', flag: '🇸🇩' },
  { iso: 'BR', name: 'Brazil', dial: '55', flag: '🇧🇷' },
  { iso: 'MX', name: 'Mexico', dial: '52', flag: '🇲🇽' },
  { iso: 'AR', name: 'Argentina', dial: '54', flag: '🇦🇷' },
  { iso: 'CL', name: 'Chile', dial: '56', flag: '🇨🇱' },
  { iso: 'CO', name: 'Colombia', dial: '57', flag: '🇨🇴' },
];

// The default country selected when a phone input starts empty.
export const DEFAULT_COUNTRY_ISO = 'SA';

// Dial codes sorted longest-first, so "+1..." doesn't swallow "+971...".
const DIALS_BY_LENGTH = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);

/** Split a stored value like "+966555123456" into { dial, national }. */
export function parsePhone(value?: string | null): { dial: string; national: string } {
  const fallback = COUNTRY_CODES.find((c) => c.iso === DEFAULT_COUNTRY_ISO)!;
  if (!value) return { dial: fallback.dial, national: '' };

  // Keep only digits after a leading "+".
  const digits = String(value).replace(/[^\d+]/g, '').replace(/^\+/, '');
  if (!digits) return { dial: fallback.dial, national: '' };

  const match = DIALS_BY_LENGTH.find((c) => digits.startsWith(c.dial));
  if (match) {
    return { dial: match.dial, national: digits.slice(match.dial.length) };
  }
  return { dial: fallback.dial, national: digits };
}

/** Build the stored value "+<dial><national digits>" (empty string if no number). */
export function composePhone(dial: string, national: string): string {
  const n = (national || '').replace(/\D/g, '');
  return n ? `+${dial}${n}` : '';
}
