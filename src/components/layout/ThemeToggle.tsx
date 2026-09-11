import { useTheme, type ThemePreference } from '../../context/ThemeContext';

const OPTIONS: Array<{ value: ThemePreference; label: string; title: string }> = [
  { value: 'light', label: '☀️', title: 'Tema claro' },
  { value: 'system', label: '💻', title: 'Tema do sistema' },
  { value: 'dark', label: '🌙', title: 'Tema escuro' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="flex gap-0.5 rounded-lg bg-[var(--color-surface-muted)] p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          aria-label={option.title}
          aria-pressed={preference === option.value}
          onClick={() => setPreference(option.value)}
          className={`rounded-md px-2 py-1 text-sm transition-colors ${
            preference === option.value
              ? 'bg-[var(--color-surface)] shadow-sm'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
