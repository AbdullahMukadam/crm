'use client'
import { AppStore, Store } from '@/lib/store/store'
import { useRef } from 'react'
import { Provider } from 'react-redux'


export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore>(undefined)
    if (!storeRef.current) {
        storeRef.current = Store()
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}