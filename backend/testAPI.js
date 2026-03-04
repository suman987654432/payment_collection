const http = require('http');

http.get('http://localhost:5000/api/users/all', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log('Success:', parsed.success);
            console.log('Count:', parsed.data?.length);
            process.exit(0);
        } catch (e) {
            console.error('Failed to parse response:', e.message);
            process.exit(1);
        }
    });
}).on('error', (err) => {
    console.error('Request failed:', err.message);
    process.exit(1);
});
