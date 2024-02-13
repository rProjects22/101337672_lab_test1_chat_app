// frontend/js/chat.js

$(document).ready(function () {
  const socket = io();

  // Function to display chat messages
  function displayMessage(fromUser, message) {
      $('#chatMessages').append(`<p><strong>${fromUser}:</strong> ${message}</p>`);
  }

  // Function to handle receiving messages
  socket.on('chatMessage', function (message) {
      displayMessage(message.from_user, message.message);
  });

  // Function to send a message
  function sendMessage() {
      let message = $('#messageInput').val();
      socket.emit('sendMessage', { message: message });

      // Clear input field after sending message
      $('#messageInput').val('');
  }

  // Retrieve existing chat messages when the page loads
  function getChatMessages() {
      $.get('/api/chat/messages', function (response) {
          if (response.success) {
              response.messages.forEach(message => {
                  displayMessage(message.from_user, message.message);
              });
          }
      });
  }

  // Call function to retrieve existing chat messages
  getChatMessages();

  // Event listener for sending a message when Send button is clicked
  $('#sendMessageBtn').click(sendMessage);

  // Event listener for sending a message when Enter key is pressed in the input field
  $('#messageInput').keypress(function (e) {
      if (e.which == 13) {
          sendMessage();
      }
  });

  // Event listener for logout button
  $('#logoutBtn').click(function () {
      $.get('/api/user/logout', function (response) {
          if (response.success) {
              window.location.href = '/login.html'; // Redirect to login page upon successful logout
          }
      });
  });
});
