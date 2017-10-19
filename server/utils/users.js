// [{
//     id: '',
//     name: '',
//     room: ''
// }]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)


class Users {
    constructor() {
        this.users = [];
    };

    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    };

    removeUser(id) {
        var userToDelete = this.users.filter((user) => user.id === id)[0];
        this.users = this.users.filter((user) => user.id !== id);
        return userToDelete;
    };

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    };

    getUserList(room) {
        var matchingUsers = this.users.filter((obj) => obj.room === room);
        var namesArray = matchingUsers.map((user) => user.name );
        return namesArray;
    };
};

module.exports = {Users};




// class Person {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     };

//     getUserDescription() {
//         var yearString = this.age > 1 ? 'years' : 'year';
//         return `${this.name} is ${this.age} ${yearString} old`;
//     }
// };

// var me = new Person('Flip', 31);
// var description = me.getUserDescription();
// console.log(description);