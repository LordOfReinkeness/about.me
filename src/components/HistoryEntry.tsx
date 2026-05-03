import type { HistoryEntry as HistoryEntryType } from '../hooks/useTerminal';
import { OutputBlock } from './OutputBlock';
import { Prompt } from './Prompt';

type Props = {
    entry: HistoryEntryType;
};

export function HistoryEntry({ entry }: Props) {
    return (
        <div className="history-entry">
            {entry.command && (
                <div className="history-prompt-line">
                    <Prompt />
                    <span>{entry.command}</span>
                </div>
            )}
            <div className={entry.command ? 'history-output' : ''}>
                <OutputBlock output={entry.output} />
            </div>
        </div>
    );
}
