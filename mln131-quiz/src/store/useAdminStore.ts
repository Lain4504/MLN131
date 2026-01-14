import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

// Admin password - In production, this should be in environment variables
const ADMIN_PASSWORD = 'mln131admin';

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            isAuthenticated: false,

            login: (password: string) => {
                if (password === ADMIN_PASSWORD) {
                    set({ isAuthenticated: true });
                    return true;
                }
                return false;
            },

            logout: () => {
                set({ isAuthenticated: false });
            }
        }),
        {
            name: 'admin-auth-storage'
        }
    )
);
