const BASE_URL = 'http://localhost:4000/api';
const TEST_EMAIL = `test_features_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

async function run() {
    const { default: fetch } = await import('node-fetch');
    console.log('--- Starting Feature Verification ---');

    // 1. Register/Login
    console.log(`\n1. Registering/Logging in user: ${TEST_EMAIL}`);
    let res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });

    if (!res.ok) {
        console.error('Login/Registration failed:', await res.text());
        process.exit(1);
    }
    let data = await res.json();
    let token = data.token;
    console.log('Login/Registration successful.');

    // 2. Test CBT Exercises
    console.log('\n2. Testing CBT Exercises...');
    // Create
    res = await fetch(`${BASE_URL}/cbt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            type: 'cognitive_restructuring',
            content_json: { situation: 'Test situation', automaticThought: 'Test thought' }
        })
    });
    if (!res.ok) throw new Error(`Create CBT failed: ${await res.text()}`);
    console.log('CBT Exercise created.');

    // Get
    res = await fetch(`${BASE_URL}/cbt`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (data.length !== 1) throw new Error('Expected 1 CBT exercise');
    console.log('CBT Exercises fetched successfully.');

    // 3. Test Sobriety Log
    console.log('\n3. Testing Sobriety Log...');
    // Create/Update
    const startDate = new Date().toISOString();
    res = await fetch(`${BASE_URL}/sobriety`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            start_date: startDate,
            relapses_json: []
        })
    });
    if (!res.ok) throw new Error(`Update Sobriety failed: ${await res.text()}`);
    console.log('Sobriety Log updated.');

    // Get
    res = await fetch(`${BASE_URL}/sobriety`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (data.start_date !== startDate) throw new Error('Sobriety date mismatch');
    console.log('Sobriety Log fetched successfully.');

    // 4. Test Triggers
    console.log('\n4. Testing Triggers...');
    // Create
    res = await fetch(`${BASE_URL}/triggers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'Test Trigger',
            category: 'General'
        })
    });
    if (!res.ok) throw new Error(`Create Trigger failed: ${await res.text()}`);
    const trigger = await res.json();
    console.log('Trigger created.');

    // Get
    res = await fetch(`${BASE_URL}/triggers`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (data.length !== 1) throw new Error('Expected 1 trigger');
    console.log('Triggers fetched successfully.');

    // Delete
    res = await fetch(`${BASE_URL}/triggers/${trigger.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Delete Trigger failed: ${await res.text()}`);
    console.log('Trigger deleted.');

    console.log('\n--- Verification Complete: SUCCESS ---');
}

run().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
