import type { Metadata } from 'next';
import { AppShell, Flex } from '@mantine/core';

import '../styles/index.scss';
import { Providers } from './providers';
import Header from '../components/layout/Header';

export const metadata: Metadata = {
    title: 'Verteco Technical Assignment',
    description: 'Verteco Technical Assignment',
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>
        <html lang="en">
            <body>
                <Providers>
                    <AppShell padding="md">
                        <Header />
                        <Flex pt={110} pb={30} px={50}>
                            <main style={{ width: '100%' }}>{children}</main>
                        </Flex>
                    </AppShell>
                </Providers>
            </body>
        </html>
    </>;
}
