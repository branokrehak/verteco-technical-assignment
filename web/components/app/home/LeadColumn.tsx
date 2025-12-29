'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Stack, Title } from '@mantine/core';

import { LeadItem } from '../../../@types/api';
import LeadCard from './LeadCard';

type ColumnId = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

type ColumnProps = {
    id: ColumnId,
    items: LeadItem[],
};

export default function LeadColumn({ id, items }: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return <>
        <Stack
            ref={setNodeRef}
            mih={100}
            flex={1}
            p={10}
            style={{
                // Hover over background color
                backgroundColor: `var(--mantine-color-${isOver ? 'dark-5' : 'dark-6'})`,
                borderRadius: 8,
            }}
        >
            <Title order={4} tt="capitalize">{id}</Title>

            <SortableContext
                items={items.map((i) => i.slug)}
                strategy={verticalListSortingStrategy}
            >
                <Stack gap={4}>
                    {items.map((item) => (
                        <LeadCard key={item.slug} data={item} />
                    ))}
                </Stack>
            </SortableContext>
        </Stack>
    </>;
}
