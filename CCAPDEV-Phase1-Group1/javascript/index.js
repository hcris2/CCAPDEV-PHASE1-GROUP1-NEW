function checkAuthentication() {
    // Read the 'accessToken' cookie
    const accessToken = getCookie('accessToken');
  
    if (!accessToken) {
      // If the 'accessToken' cookie is not present, redirect the user to the login page
      window.location.href = 'index.html';
    } else {
      // If the 'accessToken' cookie is present, allow the user to go to the task page
      window.location.href = 'plan.html';
    }
  }
  
  // Function to get the value of a cookie
  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  // Add click event listener to the element with ID 'plan'
  document.getElementById('plan').addEventListener('click', function(e) {
    e.preventDefault(); // prevent the default action
  
    // Check user's authentication status using cookies
    checkAuthentication();
  });