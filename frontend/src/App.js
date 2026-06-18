import { TopBar }      from './topBar';
import { NodeSidebar } from './sidebar';
import { PipelineUI }  from './ui';
import { StatusBar }   from './statusBar';
import { ConfigPanel } from './configPanel';
import { Analytics }   from '@vercel/analytics/react';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0f0f0f' }}>
      <TopBar />
      <div className="flex flex-1 overflow-hidden min-w-0">
        <NodeSidebar />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <PipelineUI />
          <StatusBar />
        </div>
        <ConfigPanel />
      </div>
      <Analytics />
    </div>
  );
}

export default App;
