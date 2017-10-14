const expect = require('expect');

var {generateMessage, generateLocationMessage, mapsUrl} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var response = generateMessage('Flip', 'This is my message');
        expect(response.from).toBe('Flip');
        expect(response.text).toBe('This is my message');
        expect(response.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var response = generateLocationMessage('Admin','123','456');
        expect(response.from).toBe('Admin');
        expect(response.createdAt).toBeA('number');
        expect(response.url).toBe(`${mapsUrl}123,456`);
    });
});