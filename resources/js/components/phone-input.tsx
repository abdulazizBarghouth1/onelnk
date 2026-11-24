// components/phone-input.tsx
// A phone field made of a country-code dropdown + a national-number input.
// The combined value is stored as a single "+<dial><digits>" string, so the
// rest of the app (and the server) keeps treating phone as one plain string.
import { COUNTRY_CODES, composePhone, parsePhone } from '@/data/country-codes';

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function PhoneInput({ value, onChange, placeholder, className }: Props) {
  const { dial, national } = parsePhone(value);

  const setDial = (newDial: string) => onChange(composePhone(newDial, national));
  const setNational = (raw: string) => {
    // Allow only digits/spaces while typing; store digits only.
    const cleaned = raw.replace(/[^\d\s]/g, '');
    onChange(composePhone(dial, cleaned));
  };

  return (
    <div className={`flex items-stretch gap-2 ${className || ''}`}>
      <select
        value={dial}
        onChange={(e) => setDial(e.target.value)}
        className="shrink-0 rounded-md border px-2 py-2 text-sm outline-none focus:border-primary dark:bg-gray-900"
        aria-label="Country code"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.iso} value={c.dial}>
            {c.flag} {c.iso} +{c.dial}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="numeric"
        value={national}
        onChange={(e) => setNational(e.target.value)}
        placeholder={placeholder || '5551234567'}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary dark:bg-gray-900"
      />
    </div>
  );
}
