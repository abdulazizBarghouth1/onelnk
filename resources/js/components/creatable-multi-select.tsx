// components/creatable-multi-select.tsx
// A multi-select that also lets the user create a new entry by typing a name
// that doesn't exist yet. Selected values are plain strings (names); new ones
// are created server-side on submit (firstOrCreate), so no id round-trip here.
import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Option = { value: string; label: string; color?: string };

type Props = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  allowCreate?: boolean;
};

export function CreatableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select or type to create…',
  allowCreate = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const add = (value: string) => {
    const v = value.trim();
    if (v && !selected.some((s) => s.toLowerCase() === v.toLowerCase())) {
      onChange([...selected, v]);
    }
    setSearchTerm('');
    setTimeout(() => containerRef.current?.querySelector('input')?.focus(), 10);
  };

  const remove = (value: string) => onChange(selected.filter((item) => item !== value));

  const term = searchTerm.trim();
  const filtered = options.filter(
    (o) =>
      !selected.some((s) => s.toLowerCase() === o.value.toLowerCase()) &&
      o.label.toLowerCase().includes(term.toLowerCase()),
  );
  const exactExists =
    options.some((o) => o.value.toLowerCase() === term.toLowerCase()) ||
    selected.some((s) => s.toLowerCase() === term.toLowerCase());
  const showCreate = allowCreate && term.length > 0 && !exactExists;

  const colorFor = (value: string) => options.find((o) => o.value === value)?.color;

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[38px] cursor-text"
        onClick={() => setIsOpen(true)}
      >
        {selected.map((value) => (
          <Badge key={value} variant="secondary" className="rounded-sm px-1 font-normal">
            {colorFor(value) && (
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: colorFor(value) }}
              />
            )}
            <span>{value}</span>
            <button
              type="button"
              className="ml-1 rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                remove(value);
              }}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && term) {
              e.preventDefault();
              if (showCreate || !exactExists) add(term);
              else add(term);
            }
          }}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 outline-none bg-transparent min-w-[80px]"
        />
      </div>

      {isOpen && (filtered.length > 0 || showCreate) && (
        <div className="absolute z-[60001] w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
          {filtered.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                add(option.value);
                setIsOpen(true);
              }}
            >
              {option.color && (
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: option.color }} />
              )}
              <span>{option.label}</span>
            </div>
          ))}
          {showCreate && (
            <div
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-primary"
              onClick={() => {
                add(term);
                setIsOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Create “{term}”</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
