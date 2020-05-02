import React from 'react';
import './App.css';
import ClassesVersion from './ClassesVersion';
import HooksVersion from './HooksVersion';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ClassesVersion />
        <HooksVersion />
      </header>
    </div>
  );
}

export default App;
