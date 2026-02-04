import './App.css'

function App() {
  return (
    <div className="terminal">
      <p className="terminal-line">
        <span className="prompt">visitor@lukas-reinke.de:~$</span> cat status.txt
      </p>
      <p className="terminal-output">Coming Soon...</p>
      <p className="terminal-line">
        <span className="prompt">visitor@lukas-reinke.de:~$</span>
        <span className="cursor">_</span>
      </p>
    </div>
  )
}

export default App
