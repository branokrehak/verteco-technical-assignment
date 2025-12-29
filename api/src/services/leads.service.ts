import { literal, Op } from 'sequelize';

import { Lead } from '../db/models/Lead';
import { LeadHistory } from '../db/models/LeadHistory';
import { GetLeadResponse, GetLeadsResponse, LeadsQueryParams } from '../@types/service';
import { makeUniqueSlug } from '../utils/make-unique-slug';
import { LeadCreationAttributes, LeadStatus } from '../@types/models';

export const getLeads = async (data: LeadsQueryParams): Promise<GetLeadsResponse> => {
    const { search, tag } = data;
    const conditions: Record<string, any>[] = [];

    // Filter leads that include search query param
    if (search) {
        conditions.push({
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { company: { [Op.like]: `%${search}%` } },
            ],
        });
    }

    // Filter leads that include tag query param
    if (tag) {
        conditions.push(literal(`
            EXISTS (
                SELECT 1
                FROM json_each(tags)
                WHERE value LIKE '%' || ? || '%'
            )
        `));
    }

    const leads = await Lead.findAll({
        where: {
            [Op.and]: conditions,
        },
        replacements: tag ? [tag] : [],
    });

    return leads.map(lead => ({
        slug: lead.slug,
        name: lead.name,
        company: lead.company,
        value: lead.value,
        status: lead.status,
        tags: lead.tags,
        last_change: lead.updatedAt,
    }));
}

export const getLead = async (slug: string): Promise<GetLeadResponse> => {
    const lead = await Lead.findOne({
        where: { slug },
        include: LeadHistory,
    });

    if (!lead) throw new Error();

    const formattedHistories = lead.LeadHistories?.map(lead => ({ change: lead.change, date: lead.createdAt || new Date() })) || [];

    return {
        slug: lead.slug,
        name: lead.name,
        company: lead.company,
        value: lead.value,
        email: lead.email,
        status: lead.status,
        tags: lead.tags,
        notes: lead.notes,
        last_change: lead.updatedAt,
        lead_histories: formattedHistories,
    };
}

export const createLead = async (data: LeadCreationAttributes): Promise<{ slug: string }> => {
    const { email, name, company, value, tags, notes } = data;

    const uniqueSlug = await makeUniqueSlug(Lead, data.name);

    // Change empty string email to null
    const lead = await Lead.create({ name, company, value, tags, notes, email: email || null, slug: uniqueSlug });

    await LeadHistory.create({ leadId: lead.id, change: 'Lead created' });

    return { slug: lead.slug };
}

export const updateLead = async (slug: string, data: LeadCreationAttributes): Promise<GetLeadResponse> => {
    const { email, name, company, value, tags, notes } = data;
    // Change empty string email to null
    const modifiedData = {
        email: email || null,
        name,
        company,
        value,
        tags,
        notes,
    };

    const lead = await Lead.findOne({
        where: { slug },
        include: LeadHistory,
    });

    if (!lead) throw new Error();

    const changes: string[] = [];

    // Check for lead changes
    (Object.keys(modifiedData) as (keyof LeadCreationAttributes)[]).forEach((key) => {
        const newValue = modifiedData[key];
        const oldValue = lead[key];

        let hasChanged = false;

        // Compare arrays
        if (Array.isArray(oldValue) && Array.isArray(newValue)) {
            hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);
        } else {
            hasChanged = oldValue !== newValue;
        }

        if (hasChanged) changes.push(`${key} CHANGED FROM "${oldValue}" TO "${newValue}"`);
    });

    const uniqueSlug = await makeUniqueSlug(Lead, data.name);

    // Save to db after checking lead changes
    lead.set({ ...modifiedData, slug: uniqueSlug });
    await lead.save();

    const updatedHistory = { leadId: lead.id, change: changes.join(', ') };

    // Save changes to history
    if (changes.length) await LeadHistory.create(updatedHistory);

    // Refetch histories
    const leadHistories = await LeadHistory.findAll({
        where: { leadId: lead.id },
        order: [['createdAt', 'ASC']],
    });

    const formattedHistories = leadHistories.map(lead => ({ change: lead.change, date: lead.createdAt || new Date() })) || [];

    return {
        slug: lead.slug,
        name: lead.name,
        company: lead.company,
        value: lead.value,
        email: lead.email,
        status: lead.status,
        tags: lead.tags,
        notes: lead.notes,
        last_change: lead.updatedAt,
        lead_histories: formattedHistories,
    };
}

export const updateLeadStatus = async (slug: string, status: LeadStatus): Promise<void> => {
    const lead = await Lead.findOne({
        where: { slug },
    });

    // Dont create history if the statuses are the same
    if (!lead || lead.status === status) throw new Error();

    const prevStatus = lead.status;

    lead.status = status;
    await lead.save();

    await LeadHistory.create({ leadId: lead.id, change: `Lead status CHANGED FROM "${prevStatus}" TO "${status}"` });
}
