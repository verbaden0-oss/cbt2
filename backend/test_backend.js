// const fetch = require('node-fetch'); // Using global fetch in Node 20+

// Helper to handle fetch if node-fetch isn't installed (Node 18+ has global fetch)
const request = async (url, method, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        return { status: res.status, data };
    } catch (e) {
        console.error('Request failed', e);
        return { status: 500, error: e };
    }
};

async function runTests() {
    const BASE_URL = 'http://localhost:4000/api';
    console.log('Starting tests...');

    // 1. Register
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    console.log(`Registering user: ${email}`);
    const regRes = await request(`${BASE_URL}/auth/register`, 'POST', { email, password });

    if (regRes.status !== 200) {
        console.error('Registration failed', regRes);
        process.exit(1);
    }
    console.log('Registration success', regRes.data);
    const token = regRes.data.token;

    // 2. Login
    console.log('Logging in...');
    const loginRes = await request(`${BASE_URL}/auth/login`, 'POST', { email, password });
    if (loginRes.status !== 200) {
        console.error('Login failed', loginRes);
        process.exit(1);
    }
    console.log('Login success');

    // 3. Create Trigger
    console.log('Creating trigger...');
    const trigRes = await request(`${BASE_URL}/triggers`, 'POST', { name: 'Stress', category: 'Work' }, token);
    if (trigRes.status !== 201) {
        console.error('Create trigger failed', trigRes);
    } else {
        console.log('Trigger created', trigRes.data);
    }

    // 4. Create Journal Entry
    console.log('Creating journal entry...');
    const journalRes = await request(`${BASE_URL}/journals`, 'POST', {
        date: new Date().toISOString(),
        mood_rating: 7,
        note: 'Feeling okay',
        trigger_ids: [1] // Assuming ID 1 or just testing array storage
    }, token);

    if (journalRes.status !== 201) {
        console.error('Create journal failed', journalRes);
    } else {
        console.log('Journal created', journalRes.data);
    }

    // 5. Get Journal Entries
    console.log('Fetching journal entries...');
    const getJournalRes = await request(`${BASE_URL}/journals`, 'GET', null, token);
    console.log('Journal entries:', getJournalRes.data);

    console.log('Tests completed.');
}

runTests().catch(console.error);
