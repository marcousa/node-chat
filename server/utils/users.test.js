const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Al',
            room: 'Node Course'
        },{
            id: '2',
            name: 'Barry',
            room: 'React Course'
        },{
            id: '3',
            name: 'Charlie',
            room: 'Node Course'
        }];
    });

    it('Should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Flip',
            room: 'The Office Fans'
        };
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('Should remove a user', () => {
        var removedUser = users.removeUser('1');
        expect(removedUser).toExist();
        expect(removedUser.id).toBe('1');
        expect(users.users.length).toBe(2);
        expect(users.users.map((user) => user.name)).toEqual(['Barry', 'Charlie']);
    });

    it('Should not remove user', () => {
        var removedUser = users.removeUser('123');
        expect(removedUser).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('Should find user', () => {
        var userToFind = users.getUser('2');
        expect(userToFind).toExist();
        expect(userToFind).toEqual(users.users[1]);
    });

    it('Should not find user', () => {
        var userToFind = users.getUser('123');
        expect(userToFind).toNotExist();
    });

    it('Should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Al', 'Charlie']);
    });

    it('Should return names for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Barry']);
    });

});