import { Request, Response } from 'express';

import * as leadService from '../../services/leads.service';
import { isFormDataInvalid, isStatusInvalid } from './validators';

// GET /leads
export const getLeads = async (req: Request, res: Response) => {
    try {
        const leads = await leadService.getLeads(req.query);

        res.json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch leads' });
    }
}

// GET /leads/:slug
export const getLead = async (req: Request, res: Response) => {
    try {
        const lead = await leadService.getLead(req.params.slug);

        if (!lead) throw new Error();

        res.json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch lead' });
    }
}

// POST /leads
export const createLead = async (req: Request, res: Response) => {
    try {
        if (isFormDataInvalid(req.body)) throw new Error();

        const lead = await leadService.createLead(req.body);

        if (!lead) throw new Error();

        res.status(201).json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create lead' });
    }
}

// PUT /leads/:slug
export const updateLead = async (req: Request, res: Response) => {
    try {
        if (isFormDataInvalid(req.body)) throw new Error();

        const test = req.body

        const lead = await leadService.updateLead(req.params.slug, req.body);

        if (!lead) throw new Error();

        res.json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update lead' });
    }
}

// PUT /leads/status/:slug
export const updateLeadStatus = async (req: Request, res: Response) => {
    try {
        if (isStatusInvalid(req.body.status)) throw new Error();

        await leadService.updateLeadStatus(req.params.slug, req.body.status);

        res.json({ message: 'Lead status successfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update lead' });
    }
}
