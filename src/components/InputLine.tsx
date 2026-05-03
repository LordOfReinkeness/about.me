import { useState, useEffect } from 'react';
import { Prompt } from './Prompt';

function useClock() {
    const fmt = () => {
        const now = new Date();
        return [now.getHours(), now.getMinutes(), now.getSeconds()]
            .map(n => String(n).padStart(2, '0'))
            .join(':');
    };
    const [time, setTime] = useState(fmt);
    useEffect(() => {
        const id = setInterval(() => setTime(fmt()), 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

type Props = {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function InputLine({ value, onChange, onKeyDown }: Props) {
    const time = useClock();

    return (
        <div className="input-line">
            <Prompt time={time} />
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
    );
}
