import { useGameStore } from './store/useGameStore';
import { EntryScreen } from './pages/EntryScreen';
import { QuizScreen } from './pages/QuizScreen';
import { LeaderboardScreen } from './pages/LeaderboardScreen';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const { status } = useGameStore();

  // Simple routing for demo purposes
  // In a real app, you might use react-router-dom
  const renderScreen = () => {
    // Check URL for admin access
    if (window.location.hash === '#admin') {
      return <AdminDashboard />;
    }

    switch (status) {
      case 'idle':
        return <EntryScreen />;
      case 'waiting':
        return (
          <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <h2 className="text-2xl font-bold text-neutral-text">Đang chờ chủ phòng bắt đầu...</h2>
              <p className="text-neutral-muted">Vui lòng đợi trong giây lát</p>
              <button
                onClick={() => useGameStore.getState().setStatus('playing')}
                className="mt-4 text-xs text-gray-400 hover:underline"
              >
                (Demo: Click để bắt đầu game)
              </button>
            </div>
          </div>
        );
      case 'playing':
        return <QuizScreen />;
      case 'finished':
        return <LeaderboardScreen />;
      default:
        return <EntryScreen />;
    }
  };

  return (
    <div className="font-sans">
      {renderScreen()}

      {/* Dev helper for screen switching */}
      <div className="fixed bottom-4 left-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity z-50">
        <button onClick={() => useGameStore.getState().setStatus('idle')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Idle</button>
        <button onClick={() => useGameStore.getState().setStatus('waiting')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Waiting</button>
        <button onClick={() => useGameStore.getState().setStatus('playing')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Playing</button>
        <button onClick={() => useGameStore.getState().setStatus('finished')} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Finished</button>
        <button onClick={() => window.location.hash = '#admin'} className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Admin</button>
      </div>
    </div>
  );
}

export default App;
