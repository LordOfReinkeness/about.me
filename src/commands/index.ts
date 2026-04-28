export type ContentKind = 'txt' | 'md';

export type CommandDef = {
    file: string;
    kind: ContentKind;
    description: string;
};

export const COMMANDS: Record<string, CommandDef> = {
    about: {
        file: '/content/about.md',
        kind: 'md',
        description: 'Who I am',
    },
    education: {
        file: '/content/education.md',
        kind: 'md',
        description: 'My educational background',
    },
    experience: {
        file: '/content/experience.md',
        kind: 'md',
        description: 'Work experience',
    },
    projects: {
        file: '/content/projects.md',
        kind: 'md',
        description: 'Things I have built',
    },
    skills: {
        file: '/content/skills.md',
        kind: 'md',
        description: 'Technologies and tools',
    },
    contact: {
        file: '/content/contact.md',
        kind: 'md',
        description: 'How to reach me',
    },
};

export function resolveCommand(cmd: string): CommandDef | undefined {
    return COMMANDS[cmd.trim().toLowerCase()];
}
