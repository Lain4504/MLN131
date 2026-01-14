import { create } from 'zustand';

interface GameState {
    playerName: string | null;
    roomCode: string | null;
    status: 'idle' | 'waiting' | 'playing' | 'finished';
    score: number;
    rank: number;
    players: any[];
    currentQuestionIndex: number;
    items: any[];

    setPlayerName: (name: string) => void;
    setRoomCode: (code: string) => void;
    setStatus: (status: GameState['status']) => void;
    updateScore: (points: number) => void;
    setPlayers: (players: any[]) => void;
    setCurrentQuestionIndex: (index: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
    playerName: null,
    roomCode: null,
    status: 'idle',
    score: 0,
    rank: 0,
    players: [],
    currentQuestionIndex: 0,
    items: [],

    setPlayerName: (name) => set({ playerName: name }),
    setRoomCode: (code) => set({ roomCode: code }),
    setStatus: (status) => set({ status }),
    updateScore: (points) => set((state) => ({ score: state.score + points })),
    setPlayers: (players) => set({ players }),
    setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
}));
