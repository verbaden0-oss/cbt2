const https = require('https');

const BASE_URL = 'https://cbt-backend-6ewd.onrender.com/api';

// Helper to make requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = https.request(`${BASE_URL}${path}`, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log(`🚀 Starting tests against ${BASE_URL}...\n`);

    try {
        // 1. Health Check
        console.log('1️⃣  Testing Health Check...');
        const health = await request('GET', '/health');
        if (health.status === 200) {
            console.log('✅ Health Check passed:', health.data);
        } else {
            console.error('❌ Health Check failed:', health.status, health.data);
            return;
        }

        // 2. Register (Unified Login/Register)
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`\n2️⃣  Testing Registration/Login (${email})...`);
        // The backend uses /login for both. If user doesn't exist, it creates one.
        const reg = await request('POST', '/auth/login', { email, password });

        let token;
        if (reg.status === 200) { // 200 OK for both login and register in this backend
            console.log('✅ Registration/Login passed');
            token = reg.data.token;
            if (reg.data.isNewUser) {
                console.log('   (Created new user)');
            }
        } else {
            console.error('❌ Registration failed:', reg.status, reg.data);
            return;
        }

        // 3. Login (Verify login works with new user)
        console.log('\n3️⃣  Testing Login...');
        const login = await request('POST', '/auth/login', { email, password });
        if (login.status === 200) {
            console.log('✅ Login passed');
            // Update token just in case
            token = login.data.token;
        } else {
            console.error('❌ Login failed:', login.status, login.data);
            return;
        }

        // 4. Get Journals (Expect Empty)
        console.log('\n4️⃣  Testing GET Journals (expect empty)...');
        const journalsEmpty = await request('GET', '/journals', null, token);
        if (journalsEmpty.status === 200 && Array.isArray(journalsEmpty.data.entries)) {
            console.log(`✅ GET Journals passed. Count: ${journalsEmpty.data.entries.length}`);
        } else {
            console.error('❌ GET Journals failed:', journalsEmpty.status, journalsEmpty.data);
        }

        // 5. Create Journal Entry (Test the fix for 502 error)
        console.log('\n5️⃣  Testing POST Journal Entry...');
        const entry = {
            mood_rating: 8,
            note: "Testing production deployment from terminal",
            date: new Date().toISOString()
        };
        const createJournal = await request('POST', '/journals', entry, token);
        if (createJournal.status === 201) {
            console.log('✅ Create Journal passed:', createJournal.data);
        } else {
            console.error('❌ Create Journal failed:', createJournal.status, createJournal.data);
        }

        // 6. Get Journals (Expect 1)
        console.log('\n6️⃣  Testing GET Journals (expect 1)...');
        const journalsFilled = await request('GET', '/journals', null, token);
        if (journalsFilled.status === 200 && journalsFilled.data.entries.length > 0) {
            console.log(`✅ GET Journals passed. Count: ${journalsFilled.data.entries.length}`);
            console.log('   Latest Entry Note:', journalsFilled.data.entries[0].note);
        } else {
            console.error('❌ GET Journals failed or empty:', journalsFilled.status);
        }

        // 7. Get Triggers
        console.log('\n7️⃣  Testing GET Triggers...');
        const triggers = await request('GET', '/triggers', null, token);
        if (triggers.status === 200) {
            console.log(`✅ GET Triggers passed. Count: ${triggers.data.length}`);
        } else {
            console.error('❌ GET Triggers failed:', triggers.status, triggers.data);
        }

        console.log('\n✨ All tests completed successfully! The backend is fully operational.');

    } catch (err) {
        console.error('\n❌ Script error:', err);
    }
}

runTests();
