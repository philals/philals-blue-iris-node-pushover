var Push = require('pushover-notifications')
var fs = require('fs')
require('dotenv').config({
    path: __dirname + '/.env'
})
const logLocation = __dirname + "/logfile"


try {
    const PUSHOVER_USER = process.env['PUSHOVER_USER']
    const PUSHOVER_TOKEN = process.env['PUSHOVER_TOKEN']
    const ALERT_DIR = process.env['ALERT_DIR']

    const time = process.argv[2]
    const camName = process.argv[3]
    const imageFd = process.argv[4]

    fs.readFile(ALERT_DIR + "/" + imageFd, function (err, data) {
        var p = new Push({
            user: PUSHOVER_USER,
            token: PUSHOVER_TOKEN,
            // httpOptions: {
            //   proxy: process.env['http_proxy'],
            //},
            onerror: function (error) {
                writeLog(error, time)
            },
            // update_sounds: true // update the list of sounds every day - will
            // prevent app from exiting.
        })

        var msg = {
            // These values correspond to the parameters detailed on https://pushover.net/api
            // 'message' is required. All other values are optional.
            message: camName,	// required
            title: "Motion Detected",
            sound: 'magic',
            // device: 'devicename',
            // priority: 1,
            file: { name: imageFd, data: data }
        }

        p.send(msg, function (err, result) {
            if (err) {
                writeLog(err, time)
                throw err
            }
        })
    })
} catch (error) {
    writeLog(error, time)
}



function writeLog(text, time) {
    fs.appendFileSync(logLocation, time + ": " + text + "\r\n");
}

function clearLog() {
    fs.writeFileSync(logLocation, "");
}