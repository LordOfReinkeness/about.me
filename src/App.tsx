import { useTerminal } from './hooks/useTerminal';
import { Terminal } from './components/Terminal';

export function App() {
    const { history, input, handleInputChange, handleKeyDown } = useTerminal();

    return (
        <Terminal
            history={history}
            input={input}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
        />
    );
}
