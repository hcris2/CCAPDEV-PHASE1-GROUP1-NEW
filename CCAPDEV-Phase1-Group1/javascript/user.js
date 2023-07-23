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
      .then(response => {
        if (response.ok) {
          alert('Login successful');
          localStorage.setItem('loggedIn', 'true'); // Set a flag to indicate the user is logged in
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

  $('.tab a').on('click', function(e) {
    e.preventDefault();
    const target = $(this).attr('href');
    const loggedIn = localStorage.getItem('loggedIn');

    if (target === '#plan' && !loggedIn) {
      alert('Please log in or sign up to access the Plan tab.');
    } else {
      $('.tab.active').removeClass('active');
      $(this).parent().addClass('active');

      $('.tab-content > div').hide();
      $(target).fadeIn(600);
    }
  });

  // Check if the user is already logged in
  if (localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'plan.html'; // Redirect to plan.html if already logged in
  }
});