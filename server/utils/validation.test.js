const expect = require('expect');

//import isRealString
const {isRealString} = require('./validation');

describe('isRealString validation', () => {
    it('Should reject non-string values', () => {
        expect(isRealString(123)).toBe(false);
    });

    it('Should reject string with just spaces', () => {
        expect(isRealString('   ')).toBe(false);
    });

    it('Should allow strings with characters other than just spaces', () => {
        expect(isRealString('   my String 123   ')).toBe(true);
    });
});