export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export type LeadHistory = {
    change: string,
    date: Date,
};

export type LeadItem = {
    slug: string,
    name: string,
    company: string,
    value: number,
    status: LeadStatus,
    tags: string[],
    last_change?: Date,
};

export type GetLeadsResponse = LeadItem[];

export type GetLeadResponse = {
    slug: string,
    name: string,
    company: string,
    value: number,
    status: LeadStatus,
    tags: string[],
    last_change?: Date,
    email: string | null,
    notes?: string,
    lead_histories: LeadHistory[],
};

export type CreateLeadProps = {
    name: string,
    company: string,
    email: string,
    value: number,
    tags: string[],
    notes: string,
};
