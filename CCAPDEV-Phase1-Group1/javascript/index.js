document.getElementById('plan').addEventListener('click', async function(e) {
    e.preventDefault(); // prevent the default action

    // Check if the user is authenticated
    const response = await fetch('/api/is-authenticated');
    const data = await response.json();
    
    if (!data.authenticated) {
        // If the user is not logged in, redirect them to login page
        window.location.href = 'login.html';
    } else {
        // If the user is logged in, allow them to go to the plan page
        window.location.href = 'plan.html';
    }
});
