'use client';

import { MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import '@mantine/core/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    return <>
        <MantineProvider defaultColorScheme="dark">
            {children}
        </MantineProvider>
    </>;
}
