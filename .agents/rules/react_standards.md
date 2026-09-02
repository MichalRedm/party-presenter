# React & UI Standards & Guidelines

> [!IMPORTANT]
> **Trigger Paths**: `src/components/**`, `src/pages/**`, `src/hooks/**`, `src/styles/**`
> **When to Read**: MUST be read before creating or modifying UI components, hooks, or styles.

## 1. Core Principles & Stack

- **React 19 + TypeScript**: Functional components, typed props (`React.FC<Props>` or `function Component(props: Props): React.ReactElement`), strict hooks dependency arrays.
- **Tailwind CSS & Styling**:
  - High legibility on projectors: Large typography (`text-4xl`, `text-6xl`, `text-8xl`), bold contrasts, luminous accent glows.
  - Consistent layout hierarchy: Full viewport presentation canvases (`w-screen h-screen overflow-hidden`), responsive grids, flexbox alignment.
- **Accessibility & Projector Ergonomics**:
  - Discreet UI controls on projector view (keyboard shortcuts overlay toggled with `H`, mouse-move auto-hide for control buttons).
  - Clear visual feedback for active elements and remote triggers.

## 2. Declarative Code Standards (Golden Patterns)

### Controlled State & Custom Hooks
```tsx
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(handler);
  }, [value, delayMs]);
  return debouncedValue;
}
```

### Pure Presentational Projection Components
```tsx
interface TextSlideProps {
  title: string;
  subtitle?: string;
  body?: string;
  backgroundImage?: string;
  bgOpacity?: number;
}

export const TextSlideView: React.FC<TextSlideProps> = ({
  title,
  subtitle,
  body,
  backgroundImage,
  bgOpacity = 0.4,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-12">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all"
          style={{ backgroundImage: `url(${backgroundImage})`, opacity: bgOpacity }}
        />
      )}
      <div className="relative z-10 max-w-5xl space-y-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight drop-shadow-lg">{title}</h1>
        {subtitle && <p className="text-2xl md:text-4xl text-white/80 font-medium">{subtitle}</p>}
        {body && <div className="text-xl md:text-2xl text-white/90 whitespace-pre-line leading-relaxed">{body}</div>}
      </div>
    </div>
  );
};
```

---

## 3. Anti-Pattern & Pitfall Traps

| Anti-Pattern Trap | Why It Fails | Golden Pattern |
| :--- | :--- | :--- |
| **Small font sizes on Projector view (`text-sm`, `text-base`)** | Unreadable by guests looking at the projector screen from across the room. | Use `text-3xl`, `text-5xl`, `text-7xl` with prominent contrast and drop shadows. |
| **Blocking browser audio autoplay without user gesture** | Browsers block audio until first user interaction, throwing uncaught errors. | Initialize `AudioContext` lazily on first user interaction or wrap sound triggers in safe try/catch guards. |
| **Direct mutation of nested state in React context** | React skips re-rendering when objects/arrays are mutated in place. | Always use immutable state updates with spread syntax or functional updater callbacks. |
