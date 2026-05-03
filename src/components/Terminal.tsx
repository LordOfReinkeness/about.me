import { useRef, useEffect } from 'react';
import { HistoryList } from './HistoryList';
import { InputLine } from './InputLine';
import { TopBar, BottomBar } from './StatusBar';
import type { HistoryEntry } from '../hooks/useTerminal';

type Props = {
    history: HistoryEntry[];
    input: string;
    onInputChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function Terminal({ history, input, onInputChange, onKeyDown }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    return (
        <div className="terminal-root">
            <TopBar />
            <div className="terminal-body" onClick={() => (document.querySelector<HTMLInputElement>('.terminal-input'))?.focus()}>
                <HistoryList history={history} />
                <InputLine value={input} onChange={onInputChange} onKeyDown={onKeyDown} />
                <div ref={bottomRef} />
            </div>
            <BottomBar />
        </div>
    );
}
