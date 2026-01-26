const axios = require('axios');

async function runTests() {
    const API_URL = 'http://localhost:3000/api/crawl';
    console.log('🕷️ SpiderFrog Automated Feature Verification 🕷️\n');

    // Test 1: Basic Crawl & Metadata
    console.log('1️⃣  Testing Basic Crawl & Metadata...');
    try {
        const res = await axios.post(API_URL, { url: 'https://example.com' });
        const data = res.data;

        if (data.status === 200 && data.details.title.includes('Example Domain')) {
            console.log('   ✅ Crawl Success: 200 OK');
            console.log(`   ✅ Metadata Captured: "${data.details.title}"`);
        } else {
            console.error('   ❌ Crawl Failed or Metadata Missing');
        }
    } catch (e) {
        console.error('   ❌ API Error:', e.message);
    }

    // Test 2: Custom Extraction (Regex)
    console.log('\n2️⃣  Testing Custom Extraction (Regex Rules)...');
    try {
        const rules = [
            { id: '1', name: 'H1 Text', type: 'regex', value: '<h1>(.*?)</h1>' }
        ];
        const res = await axios.post(API_URL, { url: 'https://example.com', rules });
        const data = res.data;

        if (data.customData && data.customData['H1 Text'] && data.customData['H1 Text'].includes('Example Domain')) {
            console.log('   ✅ Extraction Success: Regex captured H1 correctly.');
        } else {
            console.error('   ❌ Extraction Failed:', data.customData);
        }
    } catch (e) {
        console.error('   ❌ API Error:', e.message);
    }

    // Test 3: Asset Detection
    console.log('\n3️⃣  Testing Asset Detection...');
    try {
        // google.com has images/scripts
        const res = await axios.post(API_URL, { url: 'https://www.google.com' });
        const data = res.data;

        const images = data.assets.filter(a => a.type === 'image');
        if (images.length > 0) {
            console.log(`   ✅ Assets Found: ${images.length} Images detected.`);
        } else {
            console.warn('   ⚠️ No images found (Google might be blocking or structure changed).');
        }

        if (data.links.length > 0) {
            console.log(`   ✅ Links Found: ${data.links.length} total links.`);
        }
    } catch (e) {
        console.error('   ❌ API Error:', e.message);
    }

    // Test 4: Error Handling
    console.log('\n4️⃣  Testing Error Handling (404)...');
    try {
        const res = await axios.post(API_URL, { url: 'https://httpstat.us/404' });
        const data = res.data;

        if (data.status === 404) {
            console.log('   ✅ Status Code Captured: 404 correctly identified.');
            if (data.issues.includes('Status 404')) {
                console.log('   ✅ Issue Logged: "Status 404" added to issues list.');
            }
        } else {
            console.error(`   ❌ Failed: Got status ${data.status}`);
        }
    } catch (e) {
        // 404 might throw depending on axios config, but our API should return 200 with data status 404
        console.log('   ℹ️  Note: API returned error directly:', e.message);
    }

}

runTests();
