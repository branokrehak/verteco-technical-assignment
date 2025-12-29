'use client';

import { useEffect, useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Flex, Group, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import { getLeads, updateLeadStatus } from '../api';
import { GetLeadsResponse, LeadItem, LeadStatus } from '../@types/api';
import LeadCard from '../components/app/home/LeadCard';
import LeadColumn from '../components/app/home/LeadColumn';

type ColumnId = LeadStatus;

type Columns = Record<ColumnId, LeadItem[]>;

const columnNames: ColumnId[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

export default function Home() {
    const sensors = useSensors(useSensor(PointerSensor));
    const [columns, setColumns] = useState<Columns>({ new: [], contacted: [], qualified: [], won: [], lost: [] });
    const [activeItem, setActiveItem] = useState<LeadItem | null>(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [debouncedSearch] = useDebouncedValue(searchFilter, 300);
    const [debouncedTag] = useDebouncedValue(tagFilter, 300);

    const findColumnBySlug = (slug: string): ColumnId | undefined => columnNames.find((col) => columns[col].some((item) => item.slug === slug));

    // Display card overlay
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        // Which column the item came from
        const fromColumn = findColumnBySlug(active.id as string);

        if (!fromColumn) return;

        setActiveItem(columns[fromColumn].find((i) => i.slug === active.id) ?? null);
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        // active = item that was dragged, over = item OR column it was dropped over
        const { active, over } = event;

        // Clear card overlay
        setActiveItem(null);

        // Check if element was dropped outside of columns
        if (!over) return;

        // Which column the item came from
        const fromColumn = findColumnBySlug(active.id as string);
        // Which column the item was dropped into
        const toColumn = columnNames.includes(over.id as ColumnId)
            ? (over.id as ColumnId)
            : findColumnBySlug(over.id as string);

        if (!fromColumn || !toColumn) return;

        // Item was dropped inside the same column
        if (fromColumn === toColumn) {
            // Get the current index of the dragged item
            const oldIndex = columns[fromColumn].findIndex((i) => i.slug === active.id);
            // Get the index of the item we dropped over
            const newIndex = columns[toColumn].findIndex((i) => i.slug === over.id);

            // Only update state if the position actually changed
            if (oldIndex !== newIndex) {
                setColumns({
                    ...columns,
                    [fromColumn]: arrayMove(
                        columns[fromColumn],
                        oldIndex,
                        newIndex,
                    ),
                });
            }
            // Item was dropped into a different column
        } else {
            // Find the dragged item in its original column
            const item = columns[fromColumn].find((i) => i.slug === active.id);

            if (!item) return;

            setColumns({
                ...columns,
                // Remove from previous column
                [fromColumn]: columns[fromColumn].filter(
                    (i) => i.slug !== active.id
                ),
                //Add to the new column
                [toColumn]: [...columns[toColumn], item],
            });

            updateLeadStatus(item.slug, toColumn).then(async (response) => {
                if (!response.ok) throw new Error();

                console.log('Lead status successfully updated');
            }).catch(() => {
                console.error('Failed to update lead status');
            });
        }
    }

    useEffect(() => {
        getLeads(debouncedSearch, debouncedTag).then(async (response) => {
            if (!response.ok) throw new Error();

            const data: GetLeadsResponse = await response.json();
            const columns = {
                new: data.filter(val => val.status === 'new'),
                contacted: data.filter(val => val.status === 'contacted'),
                qualified: data.filter(val => val.status === 'qualified'),
                won: data.filter(val => val.status === 'won'),
                lost: data.filter(val => val.status === 'lost'),
            };

            setColumns(columns);
        }).catch(() => {
            console.error('Failed to fetch leads');
        });
    }, [debouncedSearch, debouncedTag]);

    return <>
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Group mb={24}>
                <TextInput w={450} placeholder="Filter by name, company or email" value={searchFilter} onChange={(e) => setSearchFilter(e.currentTarget.value)} />
                <TextInput w={450} placeholder="Filter by tag" value={tagFilter} onChange={(e) => setTagFilter(e.currentTarget.value)} />
            </Group>

            {columns && <>
                <Flex gap={16}>
                    {columnNames.map((col) => (
                        <LeadColumn key={col} id={col} items={columns[col]} />
                    ))}
                </Flex>
            </>}

            <DragOverlay>
                {activeItem && <LeadCard data={activeItem} isOverlay />}
            </DragOverlay>
        </DndContext>
    </>;
}
