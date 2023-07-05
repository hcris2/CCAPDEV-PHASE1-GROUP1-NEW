document.getElementById('plan').addEventListener('click', function(e) {
    e.preventDefault(); // prevent the default action

    // Check if user data exists in local storage
    let user = localStorage.getItem('user');
    if (!user) {
        // If user is not logged in, redirect them to login page
        window.location.href = 'login.html';
    } else {
        // If user is logged in, allow them to go to task page
        window.location.href = 'plan.html';
    }
});

