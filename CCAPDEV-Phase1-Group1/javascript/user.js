$(document).ready(function() {
  // User registration logic
  $('#signup_form').on('submit', function(event) {
    event.preventDefault();
    const username = $('#signup_username').val();
    const password = $('#signup_password').val();

    // Perform the registration logic, such as storing the user in the database or local storage
    // Replace the following lines with your own registration logic

    // Check if the user already exists in the database or local storage
    if (localStorage.getItem(username)) {
      alert('Username already exists. Please choose a different username.');
    } else {
      // Store the user data in local storage
      localStorage.setItem(username, password);
      alert('Registration successful');
      $('.tab.active').removeClass('active');
      $('#login').addClass('active'); // Switch to the "Log In" tab
    }
  });

  // User login logic
  $('#login_form').on('submit', function(event) {
    event.preventDefault();
    const username = $('#login_username').val();
    const password = $('#login_password').val();

    // Retrieve the user data from local storage
    const storedPassword = localStorage.getItem(username);

    // Validate the entered password against the stored password
    if (storedPassword && storedPassword === password) {
      // Successful login
      alert('Login successful');
      localStorage.setItem('loggedIn', 'true'); // Set a flag to indicate the user is logged in
      window.location.href = 'plan.html'; // Redirect to task.html after successful login
    } else {
      // Invalid login credentials
      alert('Invalid login credentials');
    }
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
    window.location.href = 'plan.html'; // Redirect to task.html if already logged in
  }
});
