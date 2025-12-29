'use client';

import { Flex, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';

import '../../../styles/app/leads/detail.scss';
import { CreateLeadProps } from '../../../@types/api';
import LeadForm from '../../../components/app/leads/LeadForm';
import { createLead } from '../../../api';

export default function Page() {
    const router = useRouter();

    const handleFormSubmit = async (values: CreateLeadProps) => {
        createLead(values).then(async (response) => {
            if (!response.ok) throw new Error();

            const data = await response.json();
            router.push(`/leads/detail/${data.slug}`);
        }).catch(() => {
            console.error('Failed to create lead');
        });
    }

    return <>
        <section className="lead-create">
            <Flex direction="column" w="50%">
                <Title order={2} mb={8}>Lead Create</Title>
                <LeadForm handleSubmit={handleFormSubmit} />
            </Flex>
        </section>
    </>;
}
