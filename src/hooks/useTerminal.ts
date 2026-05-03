import { useState, useEffect, useCallback } from 'react';
import { COMMANDS, resolveCommand } from '../commands';
import { runRuntimeCommand } from '../commands/runtime';

export type OutputData =
    | { kind: 'txt';     content: string }
    | { kind: 'md';      content: string }
    | { kind: 'error';   message: string }
    | { kind: 'loading' };

export type HistoryEntry = {
    id: number;
    command: string;
    time: string;
    output: OutputData;
};

let nextId = 1;

function formatTime() {
    const now = new Date();
    return [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0'))
        .join(':');
}

export function useTerminal() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [, setHistoryIndex] = useState(-1);
    const [input, setInput] = useState('');
    const [promptTime, setPromptTime] = useState(formatTime);

    const showWelcome = useCallback(() => {
        const id = nextId++;
        setHistory([{ id, command: '', time: formatTime(), output: { kind: 'loading' } }]);

        fetch('/content/welcome.txt')
            .then(r => r.text())
            .then(content => {
                setHistory(prev =>
                    prev.map(e => e.id === id ? { ...e, output: { kind: 'txt', content } } : e)
                );
            })
            .catch(() => {
                setHistory(prev => prev.filter(e => e.id !== id));
            });
    }, []);

    // Auto-display welcome on mount
    useEffect(() => {
        showWelcome();
    }, [showWelcome]);

    const executeCommand = useCallback((raw: string, time: string) => {
        const trimmed = raw.trim();
        const [firstToken = ''] = trimmed.split(/\s+/);
        const cmd = firstToken.toLowerCase();

        if (!cmd) return;

        if (cmd === 'clear') {
            showWelcome();
            setCommandHistory(prev => [raw, ...prev]);
            setHistoryIndex(-1);
            return;
        }

        if (cmd === 'help') {
            const lines = Object.entries(COMMANDS)
                .map(([name, def]) => `  ${name.padEnd(12)}${def.description}`)
                .join('\n');
            const output = `Available commands:\n\n${lines}\n\n  help        Show this help`;

            const id = nextId++;
            setHistory(prev => [...prev, { id, command: raw, time, output: { kind: 'txt', content: output } }]);
            setCommandHistory(prev => [raw, ...prev]);
            setHistoryIndex(-1);
            return;
        }

        const runtimeResult = runRuntimeCommand(raw, COMMANDS);
        if (runtimeResult) {
            const id = nextId++;
            setHistory(prev => [...prev, { id, command: raw, time, output: { kind: 'loading' } }]);
            setCommandHistory(prev => [raw, ...prev]);
            setHistoryIndex(-1);

            if (runtimeResult.kind === 'file') {
                fetch(runtimeResult.file)
                    .then(r => {
                        if (!r.ok) throw new Error(`${r.status}`);
                        return r.text();
                    })
                    .then(content => {
                        setHistory(prev =>
                            prev.map(e => e.id === id ? { ...e, output: { kind: runtimeResult.outputKind, content } } : e)
                        );
                    })
                    .catch(() => {
                        setHistory(prev =>
                            prev.map(e => e.id === id ? { ...e, output: { kind: 'error', message: runtimeResult.notFoundMessage } } : e)
                        );
                    });
                return;
            }

            if (runtimeResult.kind === 'txt') {
                setHistory(prev =>
                    prev.map(e => e.id === id ? { ...e, output: { kind: 'txt', content: runtimeResult.content } } : e)
                );
                return;
            }

            setHistory(prev =>
                prev.map(e => e.id === id ? { ...e, output: { kind: 'error', message: runtimeResult.message } } : e)
            );
            return;
        }

        const def = resolveCommand(cmd);

        if (!def) {
            const id = nextId++;
            setHistory(prev => [...prev, {
                id,
                command: raw,
                time,
                output: { kind: 'error', message: `command not found: ${cmd}. Type 'help' for available commands.` },
            }]);
            setCommandHistory(prev => [raw, ...prev]);
            setHistoryIndex(-1);
            return;
        }

        // Push loading entry, then fetch and replace
        const id = nextId++;
        setHistory(prev => [...prev, { id, command: raw, time, output: { kind: 'loading' } }]);
        setCommandHistory(prev => [raw, ...prev]);
        setHistoryIndex(-1);

        fetch(def.file)
            .then(r => {
                if (!r.ok) throw new Error(`${r.status}`);
                return r.text();
            })
            .then(content => {
                setHistory(prev =>
                    prev.map(e => e.id === id ? { ...e, output: { kind: def.kind, content } } : e)
                );
            })
            .catch(() => {
                setHistory(prev =>
                    prev.map(e => e.id === id ? { ...e, output: { kind: 'error', message: `failed to load content for: ${cmd}` } } : e)
                );
            });
    }, [showWelcome]);

    const handleInputChange = useCallback((value: string) => {
        setInput(value);
        setHistoryIndex(-1);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            showWelcome();
            setInput('');
            setHistoryIndex(-1);
            setPromptTime(formatTime());
            return;
        }

        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            const interruptedAt = formatTime();
            const id = nextId++;
            setHistory(prev => [...prev, {
                id,
                command: '^C',
                time: interruptedAt,
                output: { kind: 'txt', content: '' },
            }]);
            setInput('');
            setHistoryIndex(-1);
            setPromptTime(formatTime());
            return;
        }

        if (e.key === 'Enter') {
            const submittedAt = formatTime();
            executeCommand(input, submittedAt);
            setInput('');
            setPromptTime(formatTime());
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHistoryIndex(prev => {
                const next = Math.min(prev + 1, commandHistory.length - 1);
                setInput(commandHistory[next] ?? '');
                return next;
            });
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHistoryIndex(prev => {
                const next = prev - 1;
                if (next < 0) {
                    setInput('');
                    return -1;
                }
                setInput(commandHistory[next] ?? '');
                return next;
            });
        }
    }, [input, commandHistory, executeCommand]);

    return { history, input, promptTime, handleInputChange, handleKeyDown };
}
