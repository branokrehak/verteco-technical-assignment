'use client';

import { Button, Group, NumberInput, TagsInput, Textarea, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';

import '../../../styles/app/leads/detail.scss';
import { CreateLeadProps, GetLeadResponse } from '../../../@types/api';

export default function LeadForm({ data, handleSubmit }: { data?: GetLeadResponse, handleSubmit: (values: CreateLeadProps) => void }) {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: data?.name || '',
            company: data?.company || '',
            email: data?.email || '',
            value: data?.value || 0,
            tags: data?.tags || [],
            notes: data?.notes || '',
        },

        validate: {
            name: (value) => {
                if (!value) return 'Name is required';
                else if (value.length < 2) return 'Name is too short';
                else if (value.length > 30) return 'Name is too long';
                else return null;
            },
            company: (value) => {
                if (!value) return 'Company is required';
                else if (value.length < 2) return 'Company name is too short';
                else if (value.length > 30) return 'Company name is too long';
                else return null;
            },
            email: (value) => {
                if (!value) return null;
                return isEmail('Email is invalid')(value);
            },
            value: (value) => value > 0 ? null : 'Value must be greater than 0',
        },
    });

    return <>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Lead name"
                key={form.key('name')}
                {...form.getInputProps('name')}
            />
            <TextInput
                withAsterisk
                label="Company"
                placeholder="Company name"
                key={form.key('company')}
                {...form.getInputProps('company')}
            />
            <TextInput
                label="Email"
                placeholder="Lead email"
                key={form.key('email')}
                {...form.getInputProps('email')}
            />
            <NumberInput
                withAsterisk
                label="Value"
                min={0}
                placeholder="Lead value"
                key={form.key('value')}
                {...form.getInputProps('value')}
            />
            <TagsInput
                label="Tags"
                placeholder="Lead tags"
                key={form.key('tags')}
                {...form.getInputProps('tags')}
            />
            <Textarea
                label="Notes"
                placeholder="Lead notes"
                key={form.key('notes')}
                {...form.getInputProps('notes')}
            />

            <Group justify="flex-start" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    </>;
}
