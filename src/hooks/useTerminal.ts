import { useState, useEffect, useCallback } from 'react';
import { COMMANDS, resolveCommand } from '../commands';

export type OutputData =
    | { kind: 'txt';     content: string }
    | { kind: 'md';      content: string }
    | { kind: 'error';   message: string }
    | { kind: 'loading' };

export type HistoryEntry = {
    id: number;
    command: string;
    output: OutputData;
};

let nextId = 1;

export function useTerminal() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [, setHistoryIndex] = useState(-1);
    const [input, setInput] = useState('');

    // Auto-display welcome on mount
    useEffect(() => {
        const id = nextId++;
        setHistory([{ id, command: '', output: { kind: 'loading' } }]);

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

    const executeCommand = useCallback((raw: string) => {
        const cmd = raw.trim().toLowerCase();

        if (!cmd) return;

        if (cmd === 'clear') {
            setHistory([]);
            setCommandHistory(prev => [raw, ...prev]);
            setHistoryIndex(-1);
            return;
        }

        if (cmd === 'help') {
            const lines = Object.entries(COMMANDS)
                .map(([name, def]) => `  ${name.padEnd(12)}${def.description}`)
                .join('\n');
            const output = `Available commands:\n\n${lines}\n\n  clear       Clear the terminal\n  help        Show this help`;

            const id = nextId++;
            setHistory(prev => [...prev, { id, command: raw, output: { kind: 'txt', content: output } }]);
            setCommandHistory(prev => [raw, ...prev]);
            setHistoryIndex(-1);
            return;
        }

        const def = resolveCommand(cmd);

        if (!def) {
            const id = nextId++;
            setHistory(prev => [...prev, {
                id,
                command: raw,
                output: { kind: 'error', message: `command not found: ${cmd}. Type 'help' for available commands.` },
            }]);
            setCommandHistory(prev => [raw, ...prev]);
            setHistoryIndex(-1);
            return;
        }

        // Push loading entry, then fetch and replace
        const id = nextId++;
        setHistory(prev => [...prev, { id, command: raw, output: { kind: 'loading' } }]);
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
    }, []);

    const handleInputChange = useCallback((value: string) => {
        setInput(value);
        setHistoryIndex(-1);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            executeCommand(input);
            setInput('');
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

    return { history, input, handleInputChange, handleKeyDown };
}
