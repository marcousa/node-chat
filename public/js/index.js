var socket = io();

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
    newLi.innerHTML = html;
    document.getElementById('messages').appendChild(newLi);
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