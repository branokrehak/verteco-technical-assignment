import validator from 'validator';

import { LeadCreationAttributes, LeadStatus } from '../../@types/models';

const validStatuses = ['new', 'contacted', 'qualified', 'won', 'lost'];

export const isFormDataInvalid = (data: LeadCreationAttributes) => {
    const modifiedEmail = data.email || null;

    if (
        (data.name.length < 2 || data.name.length > 30) ||
        (data.company.length < 2 || data.company.length > 30) ||
        (data.value <= 0) ||
        (modifiedEmail && !validator.isEmail(modifiedEmail))
    ) return true;
    else return false;
}

export const isStatusInvalid = (status: LeadStatus) => {
    if (!validStatuses.includes(status)) return true;
    else return false;
}
