import { COMMANDS } from '../commands';

const PROFILE = {
    name:     'Lukas Reinke',
    role:     'Software Engineer',
    location: 'Germany',
    github:   'github.com/lordofreinkeness',
};

const COMMAND_HINTS = Object.keys(COMMANDS).concat(['help', 'clear']).join('  •  ');

export function TopBar() {
    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <span className="tb-name">{PROFILE.name}</span>
                <span className="tb-sep"> ❯ </span>
                <span className="tb-role">{PROFILE.role}</span>
                <span className="tb-sep"> ❯ </span>
                <span className="tb-location">{PROFILE.location}</span>
            </div>
            <div className="top-bar-right">
                <span className="tb-github">{PROFILE.github}</span>
            </div>
        </div>
    );
}

export function BottomBar() {
    return (
        <div className="bottom-bar">
            <span className="bb-hint">commands: </span>
            <span className="bb-commands">{COMMAND_HINTS}</span>
        </div>
    );
}
