const moment = require("moment")

const { createLogger, transports, format } = require('winston')

export const logger = createLogger({
  format: format.printf((log: any) => {
    let thisMoment = moment().tz('Europe/Kiev').format('DD-MM-YYYY, HH:mm:ss')
    return `${thisMoment}: [${log.level.toUpperCase()}] ${log.message}`
  }),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'src/logs/server-logs.log' })
  ]
})
