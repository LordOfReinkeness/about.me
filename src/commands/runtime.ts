import type { CommandDef } from './index';

type VirtualEntry = {
    name: string;
    hidden?: boolean;
    file?: string;
    virtualContent?: string;
    modified: string;
    size: number;
};

type RuntimeResult =
    | { kind: 'txt'; content: string }
    | { kind: 'error'; message: string }
    | { kind: 'file'; file: string; outputKind: 'txt' | 'md'; notFoundMessage: string };

const HIDDEN_ENTRIES: VirtualEntry[] = [
    {
        name: '.vault',
        hidden: true,
        virtualContent: 'Easter egg unlocked.\n\nThe quieter you type, the more the terminal whispers back.',
        modified: '2026-05-03',
        size: 84,
    },
];

function parseTokens(raw: string) {
    return raw.trim().split(/\s+/).filter(Boolean);
}

function commandEntries(commands: Record<string, CommandDef>): VirtualEntry[] {
    return Object.entries(commands).map(([name, def]) => ({
        name: `${name}.md`,
        file: def.file,
        modified: '2026-05-03',
        size: def.description.length * 8 + 128,
    }));
}

function formatSize(size: number, human: boolean) {
    if (!human) return `${size}`;
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}K`;
    return `${(size / (1024 * 1024)).toFixed(1)}M`;
}

function parseLsFlags(args: string[]) {
    let showAll = false;
    let long = false;
    let human = false;

    for (const arg of args) {
        if (!arg.startsWith('-')) {
            return { ok: false, error: `ls: cannot access '${arg}': No such file or directory` } as const;
        }
        for (const flag of arg.slice(1)) {
            if (flag === 'a') showAll = true;
            else if (flag === 'l') long = true;
            else if (flag === 'h') human = true;
            else return { ok: false, error: `ls: invalid option -- '${flag}'` } as const;
        }
    }

    return { ok: true, showAll, long, human } as const;
}

function handleLs(args: string[], entries: VirtualEntry[]): RuntimeResult {
    const flags = parseLsFlags(args);
    if (!flags.ok) return { kind: 'error', message: flags.error };

    const visible = flags.showAll ? entries : entries.filter(entry => !entry.hidden);
    const sorted = [...visible].sort((a, b) => a.name.localeCompare(b.name));

    if (!flags.long) {
        const names = flags.showAll ? ['.', '..', ...sorted.map(e => e.name)] : sorted.map(e => e.name);
        return { kind: 'txt', content: names.join('  ') || '' };
    }

    const list = flags.showAll
        ? [
            'drwxr-xr-x  1 guest  staff   64 2026-05-03 .',
            'drwxr-xr-x  1 guest  staff   64 2026-05-03 ..',
            ...sorted.map(entry => {
                const type = entry.hidden ? '-rw-------' : '-rw-r--r--';
                const size = formatSize(entry.size, flags.human);
                return `${type}  1 guest  staff  ${size.padStart(4)} ${entry.modified} ${entry.name}`;
            }),
        ]
        : sorted.map(entry => {
            const size = formatSize(entry.size, flags.human);
            return `-rw-r--r--  1 guest  staff  ${size.padStart(4)} ${entry.modified} ${entry.name}`;
        });

    return { kind: 'txt', content: list.join('\n') };
}

function handleCat(args: string[], entries: VirtualEntry[]): RuntimeResult {
    if (args.length === 0) return { kind: 'error', message: 'cat: missing file operand' };
    if (args.length > 1) return { kind: 'error', message: `cat: ${args[1]}: No such file or directory` };

    const target = args[0];
    const entry = entries.find(item => item.name === target);
    if (!entry) return { kind: 'error', message: `cat: ${target}: No such file or directory` };

    if (entry.virtualContent) {
        return { kind: 'txt', content: entry.virtualContent };
    }

    if (!entry.file) return { kind: 'error', message: `cat: ${target}: No such file or directory` };

    return {
        kind: 'file',
        file: entry.file,
        outputKind: 'txt',
        notFoundMessage: `cat: ${target}: No such file or directory`,
    };
}

function handleWhoami(): RuntimeResult {
    return {
        kind: 'txt',
        content: 'guest',
    };
}

export function runRuntimeCommand(raw: string, commands: Record<string, CommandDef>): RuntimeResult | null {
    const tokens = parseTokens(raw);
    if (tokens.length === 0) return null;

    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    const entries = [...commandEntries(commands), ...HIDDEN_ENTRIES];

    if (cmd === 'ls') return handleLs(args, entries);
    if (cmd === 'cat') return handleCat(args, entries);
    if (cmd === 'whoami') return handleWhoami();

    return null;
}
