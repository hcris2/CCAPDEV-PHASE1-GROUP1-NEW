document.getElementById('plan').addEventListener('click', function(e) {
    e.preventDefault(); // prevent the default action
  
    // Send a GET request to the server to check if the user is authenticated
    fetch('/api/is-authenticated')
      .then(response => response.json())
      .then(data => {
        if (data.authenticated) {
          // If user is authenticated, redirect them to the plan page
          window.location.href = 'plan.html';
        } else {
          // If user is not authenticated, redirect them to the login page
          window.location.href = 'login.html';
        }
      })
      .catch(error => {
        console.log(error);
        alert('An error occurred while checking authentication');
      });
  });