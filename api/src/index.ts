import express from 'express';
import cors from 'cors';

import { sequelize } from './db';
import { createLead, getLead, getLeads, updateLead, updateLeadStatus } from './controllers/leads/leads.controller';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.get('/leads', getLeads);
app.get('/leads/:slug', getLead);
app.post('/leads', createLead);
app.put('/leads/:slug', updateLead);
app.put('/leads/status/:slug', updateLeadStatus);

try {
    sequelize.sync();
} catch (error) {
    console.log('Sequelize sync error');
}

const startServer = async () => {
    try {
        await sequelize.sync();

        app.listen(3001, () => {
            console.log(`Server running at http://localhost:${3001}`);
        });
    } catch (error) {
        console.error('Unable to connect to DB:', error);
    }
}

startServer();
