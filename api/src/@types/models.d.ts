import { Model } from 'sequelize';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export type LeadHistoryAttributes = {
    id: string,
    leadId: string,
    change: string,
    createdAt?: Date,
    updatedAt?: Date,
};

export type LeadCreationAttributes = {
    name: string,
    company: string,
    email: string | null,
    value: number,
    tags: string[],
    notes: string,
};

export type LeadModelAttributes = {
    id: string,
    slug: string,
    LeadHistories?: LeadHistoryAttributes[],
    status?: LeadStatus,
    createdAt?: Date,
    updatedAt?: Date,
} & LeadCreationAttributes;

export type LeadHistoryCreationAttributes = Omit<LeadHistoryAttributes, 'id'>;

export type LeadInstance = Model<LeadModelAttributes, LeadCreationAttributes & { slug: string }> & LeadModelAttributes;

export type LeadHistoryInstance = Model<LeadHistoryAttributes, LeadHistoryCreationAttributes> & LeadHistoryAttributes;
