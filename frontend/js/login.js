// frontend/js/login.js

$(document).ready(function () {
  // Event listener for login form submission
  $('#loginForm').submit(function (event) {
      event.preventDefault();

      // Get input values
      const username = $('#username').val();
      const password = $('#password').val();

      // Send login request to server
      $.post('/api/user/login', { username: username, password: password }, function (response) {
          if (response.success) {
              // Redirect to chat room upon successful login
              window.location.href = '/index.html';
          } else {
              // Display error message if login fails
              $('#error').text(response.message);
          }
      });
  });
});

   