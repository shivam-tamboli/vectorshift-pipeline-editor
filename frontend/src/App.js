import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';
import { Analytics }       from '@vercel/analytics/react';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
      <Analytics />
    </div>
  );
}

export default App;
