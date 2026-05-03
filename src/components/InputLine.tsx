import { Prompt } from './Prompt';

type Props = {
    time: string;
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function InputLine({ time, value, onChange, onKeyDown }: Props) {
    return (
        <div className="input-line">
            <Prompt time={time} />
            <div className="terminal-input-wrap">
                <span className="terminal-input-mirror">{value}</span>
                <span className="terminal-cursor" aria-hidden="true" />
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
                    className="terminal-input"
                />
            </div>
        </div>
    );
}
