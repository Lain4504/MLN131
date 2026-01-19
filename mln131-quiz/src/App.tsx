import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { useGameStore } from './store/useGameStore';

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans relative">
        <AppRoutes />

        {/* Dev helper for screen switching */}
        <div className="fixed bottom-4 left-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity z-50">
          <button onClick={() => useGameStore.getState().setStatus('idle')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Idle</button>
          <button onClick={() => useGameStore.getState().setStatus('waiting')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Waiting</button>
          <button onClick={() => useGameStore.getState().setStatus('playing')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Playing</button>
          <button onClick={() => useGameStore.getState().setStatus('finished')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Finished</button>
          <a href="/admin" className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Admin</a>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
