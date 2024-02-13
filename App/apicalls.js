const http = require('http');

function fetchSenderAndReceiverUids() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'example.com', // Replace with your API hostname
            port: 80, // Replace with your API port if needed
            path: '/api/uids', // Replace with your API endpoint path
            method: 'GET' // Specify the HTTP method
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const { senderUid, receiverUid } = JSON.parse(data);
                    resolve({ senderUid, receiverUid });
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

module.exports = { fetchSenderAndReceiverUids };
