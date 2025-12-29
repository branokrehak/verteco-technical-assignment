import { DataTypes } from 'sequelize';

import { sequelize } from '../index';
import { LeadInstance } from '../../@types/models';

export const Lead = sequelize.define<LeadInstance>(
    'Lead',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 30], // min 2, max 30 characters
                    msg: "Name must be between 2 and 30 characters",
                },
            },
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 30], // min 2, max 30 characters
                    msg: "Company must be between 2 and 30 characters",
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isPositive(value: number) {
                    if (value <= 0) throw new Error('Value must be greater than 0');
                }
            },
        },
        status: {
            type: DataTypes.ENUM(
                'new',
                'contacted',
                'qualified',
                'won',
                'lost',
            ),
            allowNull: true,
            defaultValue: 'new',
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'leads',
        timestamps: true,
    },
);
