const morgan = require("morgan");

const stream = {
    write: (message) => console.log(message.trim()),
};

const logger = morgan("combined", { stream });

module.exports = logger;
