import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();

const uri = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.REMOTE_ADDRESS}:${process.env.REMOTE_PORT}`;
const client = new MongoClient(uri);

let db, operations;

async function connectDB() {
    await client.connect();
    db = client.db('calculator');
    operations = await db.collection('operations');
}
await connectDB();

app.use(cors());
app.use(express.json());

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});

/** default call for execution at initialization */
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

/**
 * Handles calculation requests.
 * @function calculate
 * @route POST /calculate
 * @param {number} req.body.value1 - The first value.
 * @param {number} req.body.value2 - The second value.
 * @param {string} req.body.operation - The operation to perform.
 * @returns {object} JSON result or error.
 */
app.post('/calculate', async (req, res) => {
    const { value1, value2, operation } = req.body;

    const query = { value1, value2, operation };
    const existing = await operations.findOne(query);

    if (existing) {
        return res.json({ result: existing.result, cached: true });
    }

    let opResult;
    if (typeof value1 === 'number' && typeof value2 === 'number') {
        switch (operation) {
            case "add":
                opResult = value1 + value2;
                break;
            case "subtract":
                opResult = value1 - value2;
                break;
            case "multiply":
                opResult = value1 * value2;
                break;
            case "divide":
                opResult = value1 / value2;
                break;
        }

        await operations.insertOne({ value1, value2, operation, result: opResult });

        res.json({ result: opResult, cached: false });
    } else {
        res.status(400).json({ error: 'Invalid input' });
    }
})