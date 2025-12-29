import { LeadStatus } from './models';

type LeadHistory = {
    change: string,
    date: Date,
};

export type GetLeadsResponse = Array<{
    slug: string,
    name: string,
    company: string,
    value: number,
    status?: LeadStatus,
    tags: string[],
    last_change?: Date,
}>;

export type GetLeadResponse = {
    slug: string,
    name: string,
    company: string,
    email: string | null,
    value: number,
    status?: LeadStatus,
    tags: string[],
    notes: string,
    last_change?: Date,
    lead_histories: LeadHistory[],
};

export type LeadsQueryParams = {
    search?: string,
    tag?: string,
};
