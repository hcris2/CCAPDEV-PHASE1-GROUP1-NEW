let userId;

$(document).ready(async function() {

  await checkAuthentication();
  let userId; // Declare it outside the $(document).ready() function
  try {
    const response = await fetch('/user/id');
    const data = await response.json();
    if (data.userId) {
        userId = data.userId;
    } else {
        console.error('Failed to get user ID:', data.message);
    }
} catch (error) {
    console.error('Error fetching user ID:', error);
}

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  function logout() {
    // Remove the token from the cookie
    deleteCookie('accessToken');
    // Send a GET request to the server to clear the session
    fetch('/user/logout')
      .then(() => {
        window.location.href = 'index.html'; // Redirect to index.html after successful logout
      })
      .catch(error => {
        console.log(error);
        alert('An error occurred during logout');
      });
  }

  $('#logout_button').on('click', function(event) {
    event.preventDefault();
    logout();
  });

  async function checkAuthentication() {
  const response = await fetch('/user/is-authenticated');
  const data = await response.json();
  if (!data.authenticated) {
    alert('Please log in to access the other pages.');
    window.location.href = 'index.html';
    return false;

  }
  return true;
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
  async function redirectToPlanPage() {
    const response = await fetch('/user/is-authenticated');
    const data = await response.json();
    if (data.authenticated) {
      window.location.href = 'plan.html';
  
    } else {
      alert('Please register and log in to access the task page.');
    }
  }

  $('.plan').on('click', function(event) {
    event.preventDefault();
    redirectToPlanPage();
  });

  $('#tasks_button').on('click', function(event) {
    event.preventDefault();
    redirectToTaskPage();
  });

  $('#task_form').on('submit', async function(event) {
    event.preventDefault();

    const task = {
      task_name: document.getElementById('task_name').value,
      task_status: document.getElementById('task_status').value,
      task_content: document.getElementById('task_details').value,
      task_date: document.getElementById('task_due_date').value,
      task_priority: document.getElementById('task_priority').value,
      task_category: document.getElementById('task_category').value
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        alert('Task added successfully!');
        showTasks(); // Refresh the task list after adding the new task
        updateCalendar(); // Refresh the calendar after adding the new task
        document.getElementById('task_form').reset(); // Reset the form
        updateCalendarOnAction();
      } else {
        console.error('Failed to add task:', response.statusText);
        alert('An error occurred while adding the task.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred while adding the task.');
    }
  });

  

  $('#notification_form').on('submit', async function(event) {
    event.preventDefault();
    
    
    const notification = {
      title: document.getElementById('notification_title').value,
      body: document.getElementById('notification_body').value,
      date: document.getElementById('notification_date').value,
      userId: userId
    };
  
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
  
      if (response.ok) {
        alert('Notification added successfully!');
        showNotifications(); // Refresh the notification list after adding the new notification
        document.getElementById('notification_form').reset(); // Reset the form
      } else {
        console.error('Failed to add notification:', response.statusText);
        alert('An error occurred while adding the notification.');
      }
    } catch (error) {
      console.error('Error adding notification:', error);
      alert('An error occurred while adding the notification.');
    }
  });
  
    $(document).on('click', '#cancel_edit_button', function(event) {
    event.preventDefault();
    closeEditContainer();
  });

// Function to handle the search form submission
$('#search_form').on('submit', async function(event) {
  event.preventDefault();
  const searchQuery = $('#search_input').val().toLowerCase();

  try {
    const response = await fetch('/api/tasks'); // Fetch tasks from the API
    const tasks = await response.json();

    const matchedTasks = tasks.filter(task =>
      task.task_name.toLowerCase().includes(searchQuery)
    );

    let taskList = $('#task_list');
    taskList.empty();

    for (let task of matchedTasks) {
      let div = $('<div></div>');
      div.attr('id', `task_${task._id}`);
      div.html(`
        <h3>${task.task_name}</h3>
        <p>Status: ${task.task_status}</p>
        <p>Task Details: ${task.task_content}</p> <!-- Display actual data for "task_content" -->
        <button class="view-button" data-task-id="${task._id}">View</button>
        <button class="delete-button" data-task-id="${task._id}">Delete</button>
      `);

      div.css('border-bottom', '1px solid rgb(214, 214, 214)');
      div.css('padding-bottom', '10px');
      div.css('border-radius', '5px');
      taskList.append(div);
    }
  } catch (error) {
    console.error('Error searching tasks:', error);
  }
});


$('#view_all_button').on('click', function() {
  $.ajax({
    type: 'GET',
    url: '/api/view', // Define the endpoint on the server to handle fetching all tasks
    success: function(response) {
      showTasks(response); // Display all tasks on the page
    },
    error: function(error) {
      console.error('Error fetching tasks:', error);
      // Handle any errors that may occur during fetching tasks
    }
  });
});


$('#category_form').on('submit', async function(event) {
  event.preventDefault();
  const category = document.getElementById('category_name').value;

  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: category }), // Use 'name' instead of 'title'
    });

    if (response.ok) {
      showCategories();
      document.getElementById('category_form').reset(); // Reset the form after adding the category
    } else {
      console.error('Failed to add category:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error adding category:', error);
  }

  alert('Category added')
});

async function showTasks() {
  try {
    const response = await fetch('/api/tasks'); // Fetch tasks from the API
    const tasks = await response.json();

    let taskList = $('#task_list');
    taskList.empty();
    for (let task of tasks) {
      let div = $('<div></div>');
      div.attr('id', `task_${task._id}`);
      div.html(`
        <h3>${task.task_name}</h3>
        <p>Status: ${task.task_status}</p>
        <p>${task.task_content}</p>
        <button class="view-button" data-task-id="${task._id}">View</button>
        <button class="delete-button" data-task-id="${task._id}">Delete</button>
      `);
      div.css('border-bottom', '1px solid rgb(214, 214, 214)');
      div.css('padding-bottom', '10px');
      div.css('border-radius', '5px');
      taskList.append(div);
    }

    taskList.off('click', '.view-button');
    taskList.on('click', '.view-button', function (event) {
      event.stopPropagation();
      let taskId = $(this).attr('data-task-id');
      viewTask(taskId);
    });

    taskList.on('click', '.edit-button', function (event) {
      event.stopPropagation();
      let taskId = $(this).attr('data-task-id');
      editTask(taskId);
    });
    
    // Remove any existing click event listeners on delete buttons before adding a new one
    taskList.off('click', '.delete-button');

    taskList.on('click', '.delete-button', function (event) {
      event.stopPropagation();
      let taskId = $(this).attr('data-task-id');
      deleteTask(taskId);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function viewTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`);
    const task = await response.json();
    if (!task) {
      return alert('Task not found');
    }

    let popupContainer = document.createElement('div');
    popupContainer.id = 'taskPopupContainer';

    let popupContent = document.createElement('div');
    popupContent.id = 'taskPopupContent';
    popupContent.innerHTML = `
      <div style="text-align: center; margin-top: 10px;">
        <h3>${task.task_name}</h3>
        <p>${task.task_content}</p>
        <p>Status: ${task.task_status}</p>
        <p>Due Date: ${task.task_date}</p>
        <p>Priority: ${task.task_priority}</p>
        <p>Category: ${task.task_category}<br><br></p>
        <button class="edit-button" data-task-id="${task._id}" style="background-color: green; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Edit</button>
        <button class="close-button" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Close</button>
      </div>
    `;
    document.body.classList.add('popup-open');

    // Remove existing click event listeners on edit buttons before adding new ones
    popupContent.querySelector('.edit-button').removeEventListener('click', editTaskOnClick);
    popupContent.querySelector('.edit-button').addEventListener('click', editTaskOnClick);

    popupContent.querySelector('.close-button').addEventListener('click', function () {
      closePopup1();
    });

    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);

  } catch (error) {
    console.error('Error fetching task details:', error);
    alert('An error occurred while fetching task details');
  }
}

function editTaskOnClick() {
  let taskId = this.getAttribute('data-task-id');
  editTask(taskId);
}
    
  function closePopup1() {
    document.getElementById('taskPopupContainer').remove();
    document.body.classList.remove('popup-open');
  }

  async function editTask(id) {
    try {
      const response = await fetch(`/api/tasks/${id}`);
      const task = await response.json();
      if (!task) {
        return alert('Task not found');
      }
  
      closePopup1();
      let editContainer = document.createElement('div');
      editContainer.id = 'editContainer';
      editContainer.innerHTML = `
        <h3>Edit Task</h3>
        <form id="edit_form">
          <input type="text" id="edit_task_name" value="${task.task_name}" required>
          <textarea id="edit_task_details" required>${task.task_content}</textarea>
          <input type="date" id="edit_task_due_date" value="${task.task_date}" required>
          <div class="custom-select">
            <select id="edit_task_status" required>
              <option value="Pending" ${task.task_status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="In Progress" ${task.task_status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${task.task_status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
  
            <select id="edit_task_priority" required>
              <option value="Low" ${task.task_priority === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Medium" ${task.task_priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="High" ${task.task_priority === 'High' ? 'selected' : ''}>High</option>
            </select>
  
            <select id="edit_task_category" required>
              <option value="Personal" ${task.task_category === 'Personal' ? 'selected' : ''}>Personal</option>
              <option value="Work" ${task.task_category === 'Work' ? 'selected' : ''}>Work</option>
              <option value="Study" ${task.task_category === 'Study' ? 'selected' : ''}>Study</option>
              <option value="Other" ${task.task_category === 'Other' ? 'selected' : ''}>Other</option>
            </select>
            <button type="submit">Save</button>
            <button id="cancel_edit_button" style="background-color: #f44336; color: #fff;">Cancel</button>
          </div>
        </form>
      `;
  
      document.body.appendChild(editContainer);
  
      // Add event listener for the edit form submission
      document.getElementById('edit_form').addEventListener('submit', function (event) {
        event.preventDefault();
        saveEditedTask(id);
      });
  
      // Add event listener for the cancel button
      document.getElementById('cancel_edit_button').addEventListener('click', function (event) {
        event.preventDefault();
        closeEditContainer();
      });

      updateCalendarOnAction();
  
    } catch (error) {
      console.error('Error fetching task details for editing:', error);
      alert('An error occurred while fetching task details for editing');
    }
  }
  
  function closeEditContainer() {
    let editContainer = document.getElementById('editContainer');
    if (editContainer) {
      editContainer.remove();
    }
  }
  
  async function saveEditedTask(id) {
    try {
      const task = {
        task_name: document.getElementById('edit_task_name').value,
        task_content: document.getElementById('edit_task_details').value,
        task_date: document.getElementById('edit_task_due_date').value,
        task_status: document.getElementById('edit_task_status').value,
        task_priority: document.getElementById('edit_task_priority').value,
        task_category: document.getElementById('edit_task_category').value
      };
  
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });
  
      if (response.ok) {
        alert('Task updated');
        closeEditContainer();
        showTasks(); // Refresh the task list after updating the task
        updateCalendar(); // Refresh the calendar after updating the task
      } else {
        console.error('Failed to update task:', response.statusText);
        alert('An error occurred while updating the task.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('An error occurred while updating the task.');
    }
  }
  

  
// Delete task from MongoDB
async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Task deleted');
      showTasks(); // Refresh the task list after deleting the task
      updateCalendar(); // Refresh the calendar after deleting the task
      updateCalendarOnAction();
    } else {
      console.error('Failed to delete task:', response.statusText);
      alert('An error occurred while deleting the task.');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('An error occurred while deleting the task.');
  }
}
  

  $(document).on('click', '#task_list button.delete-button', function(event) {
    event.stopPropagation();
    let taskId = parseInt($(this).attr('data-task-id'));
    deleteTask(taskId);
  });


  async function showAllTasks() {
    try {
      const response = await fetch('/api/tasks'); // Fetch tasks from the API
      const tasks = await response.json();
  
      let taskList = '';
      for (let task of tasks) {
        taskList += `
          <div style="text-align: center;">
            <h3>${task.task_name}</h3>
            <p>Status: ${task.task_status}</p>
            <p>${task.task_content}</p>
            <p>Due date: ${task.task_date}</p>
            <p>Priority: ${task.task_priority}</p>
            <p>Category: ${task.task_category}</p>
          </div>
          <hr>
          <br>
        `;
      }
  
      let popupContainer = document.createElement('div');
      popupContainer.id = 'popupContainer';
  
      let popupContent = document.createElement('div');
      popupContent.id = 'taskPopupContent';
      popupContent.innerHTML = `
        <h2 style="font-size: 45px; font-family: 'Merriweather'; font-weight: bold;">ALL TASKS<br></h2>
        <div id="taskListContainer" class="scrollable-content">
          ${taskList}
        </div>
        <button id="exitButton" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Exit</button>
      `;
  
      popupContainer.appendChild(popupContent);
      document.body.appendChild(popupContainer);
  
      popupContainer.style.display = 'block';
  
      let exitButton = document.getElementById('exitButton');
      exitButton.addEventListener('click', function () {
        popupContainer.style.display = 'none';
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('An error occurred while fetching tasks.');
    }
  }
  $(document).on('click', '#exit_button', function() {
    $('#popupContainer').remove();
  });

  document.getElementById('view_all_button').addEventListener('click', function() {
    showAllTasks();
  });

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('exit_button').addEventListener('click', closePopup1);
    document.addEventListener('click', function(event) {
      if (event.target === document.getElementById('popupContainer')) {
        closePopup1();
      }
    });

    document.getElementById('view_all_button').addEventListener('click', function() {
      showAllTasks();
    });
  });

// Function to update the calendar with tasks
async function updateCalendar() {
  try {
    const response = await fetch('/api/tasks'); // Fetch tasks from the API
    const tasks = await response.json();

    let events = tasks.map(task => {
      return {
        id: task._id, // Use the MongoDB document _id as the event ID
        title: task.task_name,
        start: task.task_date, // Assuming task_date is the field with the date for the calendar event
        color: getEventColor(task.task_priority) // Replace with the appropriate field from MongoDB
      };
    });

    // Clear existing events and add new events from the updated tasks
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('addEventSource', events);
    $('#calendar').fullCalendar('rerenderEvents');
  } catch (error) {
    console.error('Error fetching tasks for calendar:', error);
  }
}

  // Update the calendar when tasks are added, edited, or deleted
  async function updateCalendarOnAction() {
    await updateCalendar();
  }

  function getEventColor(priority) {
    if (priority === 'Low') {
      return '#36b88e';
    } else if (priority === 'Medium') {
      return '#ffce00';
    } else if (priority === 'High') {
      return '#f44336';
    }
  }

  $('#calendar').fullCalendar({
    defaultView: 'month',
    editable: true,
    eventLimit: true,
    events: [] // Provide an empty array as the initial events data
  });

  async function getTasksForCalendar() {
    try {
      const response = await fetch('/api/tasks'); // Fetch tasks from the API
      const tasks = await response.json();
      console.log(tasks);
  
      let events = tasks.map(task => {
        return {
          id: task._id, // Use the MongoDB document _id as the event ID
          title: task.task_name,
          start: task.task_date, // Assuming task_date is the field with the date for the calendar event
          color: getEventColor(task.task_priority) // Replace with the appropriate field from MongoDB
        };
      });
  
      return events;
    } catch (error) {
      console.error('Error fetching tasks for calendar:', error);
      return [];
    }
  }

  $(document).on('click', '#task_list button', function() {
    let taskId = parseInt($(this).closest('div').attr('id').split('_')[1]);
    deleteTask(taskId);
  });



  async function showNotifications() {
    try {
      const response = await fetch('/api/notifications'); // Fetch notifications from the API
      const notifications = await response.json();
  
      let notificationList = $('#notification_list');
      notificationList.empty();
  
      for (let notification of notifications) {
        let div = $('<div></div>');
        div.attr('id', `notification_${notification._id}`);
        div.html(`
          <h3>${notification.title}</h3>
          <p>${notification.body}</p>
          <p>${notification.date}</p>
          <button class="edit-button" data-notification-id="${notification._id}">Edit</button>
          <button class="delete-button" data-notification-id="${notification._id}">Delete</button>
        `);
  
        div.css('border-bottom', '1px solid rgb(214, 214, 214)');
        div.css('padding-bottom', '10px');
        div.css('border-radius', '5px');
  
        notificationList.append(div);
      }
      
    notificationList.off('click', '.edit-button');
      // Add event listeners for edit and delete buttons
      notificationList.on('click', '.edit-button', function(event) {
        event.stopPropagation();
        let notificationId = $(this).attr('data-notification-id');
        editNotification(notificationId);
      });
      
    notificationList.off('click', '.delete-button');
      notificationList.on('click', '.delete-button', function(event) {
        event.stopPropagation();
        let notificationId = $(this).attr('data-notification-id');
        deleteNotification(notificationId);
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

// Function to edit a notification
async function editNotification(id) {
  try {
    const response = await fetch(`/api/notifications/${id}`);
    const notification = await response.json();
    if (!notification) {
      return alert('Notification not found');
    }

    let popupContainer = document.createElement('div');
    popupContainer.id = 'notificationPopupContainer';

    let popupContent = document.createElement('div');
    popupContent.id = 'notificationPopupContent';
    popupContent.innerHTML = `
      <div style="text-align: center; margin-top: 10px;">
        <h3>Edit Notification</h3>
        <label for="edit_notification_title">Title:</label>
        <input type="text" id="edit_notification_title" value="${notification.title}" required>
        <label for="edit_notification_body">Body:</label>
        <textarea id="edit_notification_body" required>${notification.body}</textarea>
        <label for="edit_notification_date">Date:</label>
        <input type="datetime-local" id="edit_notification_date" value="${notification.date}" required><br><br>
        <button class="save-button" data-notification-id="${notification._id}" style="background-color: green; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Save</button>
        <button class="cancel-button" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Cancel</button>
      </div>
    `;
    document.body.classList.add('popup-open');

    popupContent.querySelector('.save-button').addEventListener('click', function () {
      saveEditedNotification(id);
    });

    popupContent.querySelector('.cancel-button').addEventListener('click', function () {
      closePopup();
    });

    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);

  } catch (error) {
    console.error('Error fetching notification details for editing:', error);
    alert('An error occurred while fetching notification details for editing');
  }
}

function closePopup() {
  document.getElementById('notificationPopupContainer').remove();
  document.body.classList.remove('popup-open');
}

async function saveEditedNotification(id) {
  try {
    const notificationTitle = document.getElementById('edit_notification_title').value;
    const notificationBody = document.getElementById('edit_notification_body').value;
    const notificationDate = document.getElementById('edit_notification_date').value;

    if (!notificationTitle){
      alert("Please provide a title for the notification.");
      return;
    }

    if (!notificationBody){
      alert("Please provide a body for the notification.");
      return;
    }
    if (!notificationDate)  {
      alert('Please provide a date for the notification.');
      return; // Exit the function
    }

    const notification = {
      title: notificationTitle,
      body: notificationBody,
      date: notificationDate,
    };

    const response = await fetch(`/api/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    });

    if (response.ok) {
      alert('Notification updated');
      closePopup();
      showNotifications(); // Refresh the notification list after updating the notification
    } else {
      console.error('Failed to update notification:', response.statusText);
      alert('An error occurred while updating the notification.');
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    alert('An error occurred while updating the notification.');
  }
}


// Function to delete a notification
async function deleteNotification(id) {
  if (confirm("Are you sure you want to delete this notification?")) {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Notification deleted successfully.');
        showNotifications();
      } else {
        console.error('Error deleting notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }
}

  showTasks();
  //showCategories();
  showNotifications();
  updateCalendar();
  updateCalendarOnAction();
});
