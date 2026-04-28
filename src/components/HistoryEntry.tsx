import type { HistoryEntry as HistoryEntryType } from '../hooks/useTerminal';
import { OutputBlock } from './OutputBlock';

type Props = {
    entry: HistoryEntryType;
};

export function HistoryEntry({ entry }: Props) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {entry.command && (
                <div>
                    <span style={{ color: 'var(--prompt)' }}>guest@lukas:~$ </span>
                    <span>{entry.command}</span>
                </div>
            )}
            <div style={{ marginTop: entry.command ? '0.25rem' : 0 }}>
                <OutputBlock output={entry.output} />
            </div>
        </div>
    );
}
