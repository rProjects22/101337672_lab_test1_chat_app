// frontend/js/register.js

$(document).ready(function () {
  // Event listener for register form submission
  $('#registerForm').submit(function (event) {
      event.preventDefault();

      // Get input values
      const username = $('#username').val();
      const firstname = $('#firstname').val();
      const lastname = $('#lastname').val();
      const password = $('#password').val();

      // Send register request to server
      $.post('/api/user/register', {
          username: username,
          firstname: firstname,
          lastname: lastname,
          password: password
      }, function (response) {
          if (response.success) {
              // Redirect to login page upon successful registration
              window.location.href = '/login.html';
          } else {
              // Display error message if registration fails
              $('#error').text(response.message);
          }
      });
  });
});
