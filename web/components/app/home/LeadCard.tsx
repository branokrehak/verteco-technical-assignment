'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Card, Flex, Group, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { MdOutlineModeEdit } from 'react-icons/md';

import { LeadItem } from '../../../@types/api';

type LeadCardProps = {
    data: LeadItem,
    isOverlay?: boolean,
};

export default function LeadCard({ data, isOverlay = false }: LeadCardProps) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: data.slug });
    const date = new Date(data.last_change || new Date());
    const formattedDate = date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    return <>
        <Card
            ref={setNodeRef}
            withBorder
            radius={8}
            style={{
                // Change opacity of the overlay card
                opacity: isOverlay ? 0.7 : 1,
                transform: CSS.Transform.toString(transform),
                transition,
                cursor: 'grab',
                backgroundColor: 'var(--mantine-color-dark-7)',
            }}
            {...attributes}
            {...listeners}
        >
            <Flex gap={12}>
                <Stack gap={2} flex={1}>
                    <Title order={5}>{data.name}</Title>
                    <Text size="xs">Company: <b>{data.company}</b></Text>
                </Stack>
                <Stack gap={2} flex={1}>
                    <Flex onPointerDown={(e) => e.stopPropagation()} justify="flex-end">
                        <Link href={`/leads/detail/${data.slug}`} style={{ padding: '4px', margin: '-4px' }}>
                            <MdOutlineModeEdit color="white" size={20} />
                        </Link>
                    </Flex>
                    <Text size="xs">Value: <b>{data.value}</b></Text>
                    <Text size="xs">Last Update: <b>{formattedDate}</b></Text>
                </Stack>
            </Flex>
            {data.tags[0] && (
                <Flex gap={4} mt={6} align="center">
                    <Text size="xs">Tags:</Text>
                    <Group gap={2}>{data.tags.map((tag, index) => <Badge key={index} size="xs" color="gray">{tag}</Badge>)}</Group>
                </Flex>
            )}
        </Card>
    </>;
}
