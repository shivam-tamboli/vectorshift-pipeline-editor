import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';
import { Analytics }       from '@vercel/analytics/react';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-canvas">
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
      <Analytics />
    </div>
  );
}

export default App;
