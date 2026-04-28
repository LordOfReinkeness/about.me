import type { HistoryEntry as HistoryEntryType } from '../hooks/useTerminal';
import { HistoryEntry } from './HistoryEntry';

type Props = {
    history: HistoryEntryType[];
};

export function HistoryList({ history }: Props) {
    return (
        <div>
            {history.map(entry => (
                <HistoryEntry key={entry.id} entry={entry} />
            ))}
        </div>
    );
}
