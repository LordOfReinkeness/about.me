import { useTerminal } from './hooks/useTerminal';
import { Terminal } from './components/Terminal';

export function App() {
    const { history, input, promptTime, handleInputChange, handleKeyDown } = useTerminal();

    return (
        <Terminal
            history={history}
            input={input}
            promptTime={promptTime}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
        />
    );
}
