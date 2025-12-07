"use client"
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setInitialized, ValidateStoredAuth } from '@/lib/store/features/authSlice';


interface AuthInitializerProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({
    children,
    fallback = (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    )
}) => {
    const dispatch = useAppDispatch();
    const { isInitialized } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await dispatch(ValidateStoredAuth()).unwrap();
            } catch (error) {
                console.log('No valid session found');
            } finally {
                if (!isInitialized) {
                    dispatch(setInitialized());
                }
            }
        };

        if (!isInitialized) {
            initializeAuth();
        }
    }, [dispatch, isInitialized]);

    // Show loading while initializing auth
    if (!isInitialized) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};