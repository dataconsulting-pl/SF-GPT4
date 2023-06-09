const https = require('https')

var OPENAI_API_KEY = process.env["OPENAI_API_KEY"];
var OPENAI_HOSTNAME = process.env["OPENAI_HOSTNAME"];
var OPENAI_PATH = process.env["OPENAI_PATH"]; // e.q. /openai/deployments/<Deployment-Name>/chat/completions?api-version=2023-03-15-preview

function get_data(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = ''
            res.on('data', chunk => {
                data += chunk
            })
            res.on('end', () => {
                resolve(JSON.parse(data));
            })
        })
            .on('error', err => {
                console.log('Error: ', err.message)
                reject(err)
            })
        req.write(data)
        req.end()
    })
}

//(async () => console.log(await get_data(options, data)))()

module.exports = async function (context, req) {
    if (req.body) {
        var rows = req.body.data;
        var results = [];
        var index = 0;
        for (var i = 0; i < rows.length; i++){
            data = JSON.stringify({ "messages": [{ "role": "system", "content": rows[i][1].replace(/[^A-Za-z0-9 ?!.$%&,:\-/\\;]/g, " ") }, { "role": "user", "content": rows[i][2].replace(/[^A-Za-z0-9 ?!.$%&,:\-/\\;]/g, " ") }] })
            var res = await get_data({
                hostname: OPENAI_HOSTNAME,
                path: OPENAI_PATH,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': [...data].length,
                    'api-key': OPENAI_API_KEY
                }
            }, data);
            results.push([index++, res.choices?res.choices[0].message.content:res]);
        }
        results = { "data": results }
        context.res = {
            body: JSON.stringify(results)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass data in the request body"
        };
    }
} 
