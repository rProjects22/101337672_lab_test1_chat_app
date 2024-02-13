$(document).ready(function () {
     // Function to handle joining a room
     function joinRoom(room) {
         socket.emit('joinRoom', room);
     }
 
     // Event listener for room selection
     $('.room-btn').click(function () {
         const room = $(this).attr('data-room');
         joinRoom(room);
     });
 });
 