const BASE_URL = 'http://localhost:4000/api';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

async function run() {
    const { default: fetch } = await import('node-fetch');
    console.log('--- Starting Integration Verification ---');

    // 1. Register
    console.log(`\n1. Registering user: ${TEST_EMAIL}`);
    let res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });

    if (!res.ok) {
        console.error('Registration failed:', await res.text());
        process.exit(1);
    }
    let data = await res.json();
    console.log('Registration successful. User ID:', data.user.id);
    let token = data.token;

    // 2. Login (Verification)
    console.log('\n2. Verifying Login...');
    res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });

    if (!res.ok) {
        console.error('Login failed:', await res.text());
        process.exit(1);
    }
    data = await res.json();
    console.log('Login successful. Token received.');
    token = data.token; // Update token just in case

    // 3. Create Journal Entry
    console.log('\n3. Creating Journal Entry...');
    const entry = {
        date: new Date().toISOString(),
        mood_rating: 8,
        note: 'Integration test entry',
        trigger_ids: []
    };

    res = await fetch(`${BASE_URL}/journals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(entry)
    });

    if (!res.ok) {
        console.error('Create journal failed:', await res.text());
        process.exit(1);
    }
    console.log('Journal entry created.');

    // 4. Fetch Journal Entries
    console.log('\n4. Fetching Journal Entries...');
    res = await fetch(`${BASE_URL}/journals`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
        console.error('Fetch journals failed:', await res.text());
        process.exit(1);
    }
    data = await res.json();
    console.log(`Fetched ${data.entries.length} entries.`);

    const found = data.entries.find(e => e.note === 'Integration test entry');
    if (found) {
        console.log('SUCCESS: Created entry found in list.');
    } else {
        console.error('FAILURE: Created entry NOT found in list.');
        process.exit(1);
    }

    console.log('\n--- Verification Complete: SUCCESS ---');
}

run().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
