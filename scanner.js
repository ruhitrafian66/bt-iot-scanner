const async = require('async');
const axios = require('axios');
const https = require('https');
const moment = require('moment');
const { createArrayCsvWriter } = require('csv-writer');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

async function main() {
    const start = new Date();
    const client = axios.create();

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    const writer = createArrayCsvWriter({
        path: ' OrientationTestDown.csv',
        header: ['MAC', 'Vendor', 'RSSI', 'Last Seen', 'Name', 'Alias', 'Cennectable', 'Flags', 'Services'],
        append: false,
    });

    await async.whilst(
        async () => (new Date()).valueOf() - start.valueOf() <= 34 * 1000,
        async () => {
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

            try {
                const response = await client.get('https://192.168.2.2:8083/api/events', {
                    params: {
                        from: '',
                        n: '25',
                    },
                    httpsAgent,
                    headers: {
                        Authorization: 'Basic dXNlcjpwYXNz',
                    }
                });

                await async.eachSeries(response.data, async (row) => {
                    if (row.tag !== 'ble.device.new') {
                        return;
                    }
                    await writer.writeRecords([
                        [
                            row.data.mac,
                            row.data.vendor,
                            row.data.rssi,
                            moment(row.data.last_seen).format('YYYY-MM-DD HH:mm:ss'),
                            row.connectable ? 'TRUE' : 'FALSE',
                            row.data.flags,
                            row.data.services.join(','),
                        ],
                    ]);
                });

                await sleep(1000);
            } catch (e) {
                console.error(e);
            }
        }
    );
}

main().then(() => {
    process.exit();
}).catch((err) => {
    console.error(err);
    process.exit(1);
});