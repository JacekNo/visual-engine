import { Cockpit } from './components/controls/Cockpit';
import { PreviewPane } from './components/preview/PreviewPane';

function App() {
  return (
    <div className="flex h-screen w-screen bg-zinc-900 overflow-hidden font-sans">
      <Cockpit />
      <PreviewPane />
    </div>
  );
}

export default App;