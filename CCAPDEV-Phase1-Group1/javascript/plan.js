$(document).ready(async function() {
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
  
    $(document).on('click', '#cancel_edit_button', function(event) {
    event.preventDefault();
    closeEditContainer();
  });

  $('#logout_button').on('click', function(event) {
    event.preventDefault();
  
    // Make an HTTP request to the server to handle logout
    $.ajax({
      type: 'POST',
      url: '/api/logout', // Define the endpoint on the server to handle logout
      success: function(response) {
        console.log('Logout successful:', response);
        window.location.href = 'index.html';
      },
      error: function(error) {
        console.error('Error during logout:', error);
        // Handle any errors that may occur during logout
      }
    });
  });
  

 $('#search_form').on('submit', function(event) {
  event.preventDefault();
  const searchQuery = $('#search_input').val().toLowerCase();

  $.ajax({
    type: 'GET',
    url: `/api/search?search=${searchQuery}`, // Define the endpoint on the server to handle the search
    success: function(response) {
      showTasks(response);
    },
    error: function(error) {
      console.error('Error during search:', error);
      // Handle any errors that may occur during search
    }
  });
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


  $('#category_form').on('submit', function(event) {
    event.preventDefault();
    const category = document.getElementById('category_name').value;
  
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.push(category);
  
    localStorage.setItem('categories', JSON.stringify(categories));
    alert('Category added');
    showCategories();
  });

  $('#notification_form').on('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('notification_title').value;
    const body = document.getElementById('notification_body').value;
    const date = document.getElementById('notification_date').value;

    const notification = {
      id: Date.now(),
      title: title,
      body: body,
      date: date
    };

    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push(notification);

    localStorage.setItem('notifications', JSON.stringify(notifications));
    alert('Notification set');
    showNotifications();
  });

async function showTasks() {
  try {
    const response = await fetch('/api/tasks'); // Fetch tasks from the API
    const tasks = await response.json();
    console.log(tasks)

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
      closePopup();
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

  
    
  function closePopup() {
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
  
      closePopup();
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
    document.getElementById('exit_button').addEventListener('click', closePopup);
    document.addEventListener('click', function(event) {
      if (event.target === document.getElementById('popupContainer')) {
        closePopup();
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
    console.log(tasks);

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

 function showCategories() {
  let categoryList = $('#category_list');
  categoryList.empty();

  let categories = JSON.parse(localStorage.getItem('categories')) || [];

  for (let category of categories) {
    let div = $('<div></div>');
    div.attr('id', `category_${category}`);
    div.html(`
      <h3>${category}</h3>
      <button class="edit-button" data-category="${category}">Edit</button>
      <button class="delete-button" data-category="${category}">Delete</button>
    `);
    
    div.css('border-bottom', '1px solid rgb(214, 214, 214)');
    div.css('padding-bottom', '10px');
    div.css('border-radius', '5px');
    categoryList.append(div);
  }

  // Add event listeners for edit and delete buttons
  categoryList.on('click', '.edit-button', function(event) {
    event.stopPropagation();
    let category = $(this).attr('data-category');
    editCategory(category);
  });

  categoryList.on('click', '.delete-button', function(event) {
    event.stopPropagation();
    let category = $(this).attr('data-category');
    deleteCategory(category);
  });
}

function editCategory(category) {
  let newCategory = prompt('Enter a new name for the category:', category);
  if (newCategory !== null && newCategory.trim() !== '') {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let index = categories.indexOf(category);
    if (index !== -1) {
      categories[index] = newCategory;
      localStorage.setItem('categories', JSON.stringify(categories));
      showCategories();
    }
  }
}

function deleteCategory(category) {
  if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let index = categories.indexOf(category);
    if (index !== -1) {
      categories.splice(index, 1);
      localStorage.setItem('categories', JSON.stringify(categories));
      showCategories();
    }
  }
}

function showNotifications() {
  let notificationList = $('#notification_list');
  notificationList.empty();

  let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

  for (let notification of notifications) {
    let div = $('<div></div>');
    div.attr('id', `notification_${notification.id}`);
    div.html(`
      <h3>${notification.title}</h3>
      <p>${notification.body}</p>
      <p>${notification.date}</p>
      <button class="edit-button" data-notification-id="${notification.id}">Edit</button>
      <button class="delete-button" data-notification-id="${notification.id}">Delete</button>
    `);
    div.css('border-bottom', '1px solid rgb(214, 214, 214)');
    div.css('padding-bottom', '10px');
    div.css('border-radius', '5px');

    notificationList.append(div);
  }

  // Add event listeners for edit and delete buttons
  notificationList.on('click', '.edit-button', function(event) {
    event.stopPropagation();
    let notificationId = parseInt($(this).attr('data-notification-id'));
    editNotification(notificationId);
  });

  notificationList.on('click', '.delete-button', function(event) {
    event.stopPropagation();
    let notificationId = parseInt($(this).attr('data-notification-id'));
    deleteNotification(notificationId);
  });
}

function editNotification(id) {
  let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  let notification = notifications.find(notification => notification.id === id);

  if (notification) {
    // Implement the logic to edit the notification
    // For example, show a form with pre-filled values for editing and update the notification in the localStorage.
  }
}

function deleteNotification(id) {
  let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  let notification = notifications.find(notification => notification.id === id);

  if (notification) {
    // Ask for confirmation before deleting the notification
    if (confirm("Are you sure you want to delete this notification?")) {
      let updatedNotifications = notifications.filter(notification => notification.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      showNotifications();
    }
  }
}






  showTasks();
  showCategories();
  showNotifications();
  updateCalendar();
  updateCalendarOnAction();
});
