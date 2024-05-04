const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}

module.exports = corsOptions;