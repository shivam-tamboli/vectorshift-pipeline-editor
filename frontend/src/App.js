import { NodeSidebar }  from './sidebar';
import { PipelineUI }   from './ui';
import { SubmitButton } from './submit';
import { Analytics }    from '@vercel/analytics/react';

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <NodeSidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <PipelineUI />
        <SubmitButton />
      </div>
      <Analytics />
    </div>
  );
}

export default App;
