import { HistoryList } from './HistoryList';
import { InputLine } from './InputLine';
import type { HistoryEntry } from '../hooks/useTerminal';

type Props = {
    history: HistoryEntry[];
    input: string;
    onInputChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function Terminal({ history, input, onInputChange, onKeyDown }: Props) {
    return (
        <div>
            <HistoryList history={history} />
            <InputLine value={input} onChange={onInputChange} onKeyDown={onKeyDown} />
        </div>
    );
}
