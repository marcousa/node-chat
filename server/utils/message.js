const moment = require('moment');
const mapsUrl = 'https://www.google.com/maps?q=';

var generateMessage = (name, text) => {
    return {
        from: name,
        text,
        createdAt: moment().valueOf()
    };
};

var generateLocationMessage = (name, latitude, longitude) => {
    return {
        from: name,
        url: `${mapsUrl}${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
};

module.exports = {generateMessage, generateLocationMessage, mapsUrl};