'use client';

import { Badge, Card, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import '../../../../styles/app/leads/detail.scss';
import { getLead, updateLead } from '../../../../api';
import { CreateLeadProps, GetLeadResponse } from '../../../../@types/api';
import LeadForm from '@/components/app/leads/LeadForm';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const [lead, setLead] = useState<GetLeadResponse>();

    const handleFormSubmit = (values: CreateLeadProps) => {
        if (!lead) return;

        updateLead(lead.slug, values).then(async (response) => {
            if (!response.ok) throw new Error();

            const data = await response.json();
            router.push(`/leads/detail/${data.slug}`);
        }).catch(() => {
            console.error('Failed to update lead');
        });
    }

    const fetchLead = () => {
        getLead(params.slug as string).then(async (response) => {
            if (!response.ok) throw new Error();

            const data: GetLeadResponse = await response.json();
            setLead(data);
        }).catch(() => {
            console.error('Failed to fetch lead');
        });
    }

    useEffect(() => {
        fetchLead();
    }, []);

    return <>
        <section className="lead-detail">
            {lead && <>
                <Stack flex={1} gap={8}>
                    <Title order={2}>Lead Details</Title>
                    <Stack gap={4}>
                        <Text>Name: <b>{lead.name}</b></Text>
                        <Text>Company: <b>{lead.company}</b></Text>
                        {lead.email && <Text>Email: <b>{lead.email}</b></Text>}
                        <Text>Value: <b>{lead.value}</b></Text>
                        <Text>Status: <b>{lead.status}</b></Text>
                        {lead.tags[0] && (
                            <Flex gap={8} align="center">
                                <Text>Tags:</Text>
                                <Group gap={4}>{lead.tags.map((tag, index) => <Badge key={index} color="gray">{tag}</Badge>)}</Group>
                            </Flex>
                        )}
                        {lead.notes && <Text>Notes: <b>{lead.notes}</b></Text>}
                    </Stack>

                    <Title order={2}>Lead History</Title>
                    <Stack>
                        {lead.lead_histories.map((history, index) => {
                            const date = new Date(history.date);
                            const formattedDate = date.toLocaleString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                hour12: true,
                            });

                            return (
                                <Card key={index} color="gray">
                                    <Text>Change: <b>{history.change}</b></Text>
                                    <Text>When: <b>{formattedDate}</b></Text>
                                </Card>
                            );
                        })}
                    </Stack>
                </Stack>

                <Stack flex="1">
                    <Title order={2} mb={8}>Lead Edit</Title>
                    <LeadForm handleSubmit={handleFormSubmit} data={lead} />
                </Stack>
            </>}
        </section>
    </>;
}
