import type { OutputData } from '../hooks/useTerminal';
import { TxtOutput } from './TxtOutput';
import { MdOutput } from './MdOutput';

type Props = {
    output: OutputData;
};

export function OutputBlock({ output }: Props) {
    switch (output.kind) {
        case 'loading':
            return <span style={{ color: 'var(--gray)' }}>...</span>;
        case 'error':
            return <span style={{ color: 'var(--red)' }}>{output.message}</span>;
        case 'txt':
            return <TxtOutput content={output.content} />;
        case 'md':
            return <MdOutput content={output.content} />;
    }
}
