$(document).ready(function() {
  // User registration logic
  $('#signup_form').on('submit', function(event) {
    event.preventDefault();
    const username = $('#signup_username').val();
    const password = $('#signup_password').val();

    // Send a POST request to the server for registration
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (response.ok) {
          alert('Registration successful');
          $('.tab.active').removeClass('active');
          $('#login').addClass('active'); // Switch to the "Log In" tab
        } else {
          response.json().then(data => {
            alert(data.error);
          });
        }
      })
      .catch(error => {
        console.log(error);
        alert('An error occurred during registration');
      });
  });

  // User login logic
  $('#login_form').on('submit', function(event) {
    event.preventDefault();
    const username = $('#login_username').val();
    const password = $('#login_password').val();
    // Send a POST request to the server for login
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Logged in!') {
          alert('Login successful');
          setCookie('accessToken', data.token, 1); // Token expires in 1 day
          window.location.href = 'plan.html'; // Redirect to plan.html after successful login
        } else {
          alert('Invalid login credentials');
        }
      })
      .catch(error => {
        console.log(error);
        alert('An error occurred during login');
      });
  });

  // ...

  // Check if the user is already logged in using cookies
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    window.location.href = 'plan.html'; // Redirect to plan.html if already logged in
  }
});
