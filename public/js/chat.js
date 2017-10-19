var socket = io();

function scrollToBottom() {
    //Selectors
    let messages = document.getElementById('messages');
    let newMessage = messages.lastChild;
    //Heights
    let clientHeight = messages.clientHeight;
    let scrollTop = messages.scrollTop;
    let scrollHeight = messages.scrollHeight;
    // height is stored as a property in the style object
    let newMessageStyle = window.getComputedStyle(newMessage, null);
    let newMessageHeightString = newMessageStyle.getPropertyValue('height');
    // transform height value into a number since height is stored as a string with 'px' at the end
    let newMessageHeight = Number(newMessageHeightString.substring(0, newMessageHeightString.length - 2));
    let lastMessage = newMessage.previousSibling;
    let condition = undefined;
    // there is no lastMessage when the screen first loads, causing a crash
    if(!lastMessage) {
        condition = clientHeight + scrollTop + newMessageHeight;
    } else {
        let lastMessageStyle = window.getComputedStyle(lastMessage, null);
        let lastMessageHeightString = lastMessageStyle.getPropertyValue('height');
        let lastMessageHeight = Number(lastMessageHeightString.substring(0, lastMessageHeightString.length - 2));
        condition = clientHeight + scrollTop + newMessageHeight + lastMessageHeight;
    }
    
    if(condition >= scrollHeight) {
        messages.scrollTo(0, scrollHeight);
    }
}

let messageBox = document.getElementsByName('message')[0];

socket.on('connect', function() {
    var params = deparam(window.location.search);
    
    socket.emit('join', params, function(err) {
        if(err) {
            alert(err);
            return window.location.href = '/';
        }
        console.log('No error');
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    var usersDiv = document.createElement('div');
    var ol = document.createElement('ol');
    usersDiv.appendChild(ol);

    users.forEach(function(user) {
        var newLi = document.createElement('li');
        newLi.textContent = user;
        ol.appendChild(newLi);
    });

    document.getElementById('users').innerHTML = usersDiv.innerHTML;
});

socket.on('newMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = document.getElementById('message-template').innerHTML;
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    let newLi = document.createElement('li');
    newLi.setAttribute('class', 'message');
    newLi.innerHTML = html;
    document.getElementById('messages').appendChild(newLi);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = document.getElementById('location-message-template').innerHTML;
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    
    let messageDisplay = document.getElementById('messages');
    let newLi = document.createElement('li');
    newLi.setAttribute('class', 'message');
    newLi.innerHTML = html;
    messageDisplay.appendChild(newLi);
    scrollToBottom();
});

var form = document.getElementById("message-form");

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let messageBox = document.getElementsByName("message")[0];

    socket.emit('createMessage', {
        text: messageBox.value
    }, function() {
        messageBox.value = '';
    });
});

var locationButton = document.getElementById('send-location');

locationButton.addEventListener('click', function() {
    
    locationButton.setAttribute('disabled', true);
    locationButton.innerHTML = 'Sending location';

    if(!navigator.geolocation) {
        locationButton.removeAttribute('disabled');
        locationButton.innerHTML = 'Send Location';
        return alert('Your browser does not support Geolocation. \n\n Plesae upgrade to a modern browser.');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttribute('disabled');
        locationButton.innerHTML = 'Send Location';
    }, function() {
        alert('Unable to fetch location.');
        locationButton.removeAttribute('disabled');
        locationButton.innerHTML = 'Send Location';
    });
});