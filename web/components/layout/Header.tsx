'use client';

import { AppShell, Flex } from '@mantine/core';
import Link from 'next/link';

import '../../styles/components/layout/Header.scss';

export default function Header() {
    return <>
        <AppShell.Header py={16} px={50}>
            <Flex gap={32} align="center">
                <Link href="/" className="header--logo">HOME</Link>
                <ul>
                    <li><Link href="/">Leads</Link></li>
                    <li><Link href="/leads/create">Create Lead</Link></li>
                </ul>
            </Flex>
        </AppShell.Header>
    </>;
}
