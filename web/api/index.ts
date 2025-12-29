import { CreateLeadProps, LeadStatus } from '../@types/api';

export async function getLeads(searchFilter?: string, tagFilter?: string) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/leads`);

    if (searchFilter) url.searchParams.append('search', searchFilter);
    if (tagFilter) url.searchParams.append('tag', tagFilter);

    return fetch(url.toString());
}

export async function getLead(slug: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/${slug}`);
}

export async function createLead(data: CreateLeadProps) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function updateLead(slug: string, data: CreateLeadProps) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/${slug}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function updateLeadStatus(slug: string, status: LeadStatus) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/status/${slug}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
}
