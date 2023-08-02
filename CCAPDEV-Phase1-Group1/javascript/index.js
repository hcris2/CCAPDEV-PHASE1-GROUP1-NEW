document.addEventListener('DOMContentLoaded', function() {
  
  async function checkAuthentication() {
    const response = await fetch('/user/is-authenticated');
    const data = await response.json();
    if (!data.authenticated) {
      alert('Please log in to access the other pages.');
      window.location.href = '/index.html';
    }
  }
    
    async function redirectToPlanPage() {
      const response = await fetch('/user/is-authenticated');
      const data = await response.json();
      if (data.authenticated) {
        window.location.href = 'plan.html';
      } else {
        alert('Please register and log in to access the plan page.');
      }
    }
  
    
    async function redirectToTaskPage() {
      const response = await fetch('/user/is-authenticated');
      const data = await response.json();
      if (data.authenticated) {
        window.location.href = 'task_page.html';
      } else {
        alert('Please register and log in to access the task page.');
      }
    }
    document.querySelector('.plan a').addEventListener('click', function(event) {
      event.preventDefault();
      redirectToPlanPage();
  });
  
  
    document.querySelector('#tasks_button a').addEventListener('click', function(event){ 
      event.preventDefault();
      redirectToTaskPage();
    })
});


