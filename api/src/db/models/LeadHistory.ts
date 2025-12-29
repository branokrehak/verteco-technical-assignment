import { DataTypes } from 'sequelize';

import { sequelize } from '../index';
import { Lead } from './Lead';
import { LeadHistoryInstance } from '../../@types/models';

export const LeadHistory = sequelize.define<LeadHistoryInstance>(
    'LeadHistory',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        leadId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        change: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'lead_histories',
        timestamps: true,
    },
);

// Relationships
Lead.hasMany(LeadHistory, {
    foreignKey: 'leadId',
    onDelete: 'CASCADE',
});

LeadHistory.belongsTo(Lead, {
    foreignKey: 'leadId',
});
