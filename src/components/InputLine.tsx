type Props = {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function InputLine({ value, onChange, onKeyDown }: Props) {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--prompt)', flexShrink: 0 }}>guest@lukas:~$ </span>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--fg)',
                    font: 'inherit',
                    flex: 1,
                    caretColor: 'var(--fg)',
                }}
            />
        </div>
    );
}
