var socket = io();

function scrollToBottom() {
    //Selectors
    messages = document.getElementById('messages');
    newMessage = messages.lastChild;
    //Heights
    clientHeight = messages.clientHeight;
    scrollTop = messages.scrollTop;
    scrollHeight = messages.scrollHeight;
    // height is stored as a property in the style object
    newMessageStyle = window.getComputedStyle(newMessage, null);
    newMessageHeightString = newMessageStyle.getPropertyValue('height');
    // transform height value into a number since height is stored as a string with 'px' at the end
    newMessageHeight = Number(newMessageHeightString.substring(0, newMessageHeightString.length - 2));
    lastMessage = newMessage.previousSibling;
    condition = undefined;
    // there is no lastMessage when the screen first loads, causing a crash
    if(!lastMessage) {
        condition = clientHeight + scrollTop + newMessageHeight
    } else {
        lastMessageStyle = window.getComputedStyle(lastMessage, null);
        lastMessageHeightString = lastMessageStyle.getPropertyValue('height');
        lastMessageHeight = Number(lastMessageHeightString.substring(0, lastMessageHeightString.length - 2));
        condition = clientHeight + scrollTop + newMessageHeight + lastMessageHeight
    }
    
    if(condition >= scrollHeight) {
        messages.scrollTo(0, scrollHeight);
    }
}

let messageBox = document.getElementsByName('message')[0];

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
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
    newLi.innerHTML = html;
    messageDisplay.appendChild(newLi);
    scrollToBottom();
});

var form = document.getElementById("message-form");

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let messageBox = document.getElementsByName("message")[0];

    socket.emit('createMessage', {
        from: 'User',
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