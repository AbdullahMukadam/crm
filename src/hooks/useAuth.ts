import { useAppSelector } from '@/lib/store/hooks';


export const useAuth = () => {
    const auth = useAppSelector((state) => state.auth);
    
    return {
        user: {
            id: auth.id,
            username: auth.username,
            email: auth.email,
            avatarUrl: auth.avatarUrl,
            role: auth.role,
            onboarded: auth.onboarded,
        },
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        isInitialized: auth.isInitialized,
    };
};
