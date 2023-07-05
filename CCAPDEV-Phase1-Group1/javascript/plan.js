$(document).ready(function() {
  $('#task_form').on('submit', function(event) {
    event.preventDefault();

    const task = {
      id: Date.now(),
      name: document.getElementById('task_name').value,
      details: document.getElementById('task_details').value,
      dueDate: document.getElementById('task_due_date').value,
      priority: document.getElementById('task_priority').value,
      category: document.getElementById('task_category').value
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    alert('Task added');
    showTasks();
    updateCalendar();
    document.getElementById('task_form').reset();
  });

    $(document).on('click', '#cancel_edit_button', function(event) {
    event.preventDefault();
    closeEditContainer();
  });

  $('#logout_button').on('click', function(event) {
    event.preventDefault();
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  });

  document.getElementById('logout_button').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'register.html';
  });

  $('#search_form').on('submit', function(event) {
    event.preventDefault();
    const searchQuery = $('#search_input').val().toLowerCase();

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filteredTasks = tasks.filter(task => {
      const dueDate = task.dueDate.toLowerCase();
      const priority = task.priority.toLowerCase();
      const details = task.details.toLowerCase();

      return (
        dueDate.includes(searchQuery) ||
        priority.includes(searchQuery) ||
        details.includes(searchQuery)
      );
    });

    showTasks(filteredTasks);
  });

  $('#view_all_button').on('click', function() {
    showTasks();
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

  function showTasks(tasks) {
    let taskList = $('#task_list');
    taskList.empty();

    tasks = tasks || JSON.parse(localStorage.getItem('tasks')) || [];

    for (let task of tasks) {
      let div = $('<div></div>');
      div.attr('id', `task_${task.id}`);
      div.html(`
        <h3>${task.name}</h3>
        <p>${task.details}</p>
        <button class="view-button" data-task-id="${task.id}">View</button>
        <button class="delete-button" data-task-id="${task.id}">Delete</button>
      `);
      div.css('border-bottom', '1px solid rgb(214, 214, 214)');
      div.css('padding-bottom', '10px');
      div.css('border-radius', '5px');
      
      taskList.append(div);
    }

    

    /* FOR COLORS OF DELETE AND VIEW BUTTON */
    $('.view-button').css('border', '1px solid rgb(184, 88, 88)');
    $('.delete-button').css('background-color', 'rgb(255, 87, 87)');

    $('.view-button').hover(
      function() {
        $(this).css('background-color', '#8ab48a'); // Change color on hover
      },
      function() {
        $(this).css('background-color', '#A4D0A4'); // Revert color when not hovering
      }
    );

    $('.delete-button').hover(
      function() {
        $(this).css('background-color', 'rgb(248, 65, 65)'); // Change color on hover
      },
      function() {
        $(this).css('background-color', 'rgb(255, 87, 87)'); // Revert color when not hovering
      }
    );

    let taskContainer = $('#task_container');
    taskContainer.css({
      boxSizing: 'border-box'
    });

    taskList.on('click', '.view-button', function(event) {
      event.stopPropagation();
      let taskId = parseInt($(this).attr('data-task-id'));
      viewTask(taskId);
    });

    taskList.on('click', '.delete-button', function(event) {
      event.stopPropagation();
      let taskId = parseInt($(this).attr('data-task-id'));
      deleteTask(taskId);
    });

  }


  function viewTask(id) {
    
  let isExitButtonAttached = false;  // Flag to track if the event listener is already attached

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let task = tasks.find(task => task.id === id);
  
    if (task) {
      let popupContainer = document.createElement('div');
      popupContainer.id = 'taskPopupContainer';
  
      let popupContent = document.createElement('div');
      popupContent.id = 'taskPopupContent';
      popupContent.innerHTML = `
      <div style="text-align: center; margin-top: 10px;">
        <h3>${task.name}</h3>
        <p>${task.details}</p>
        <p>Due Date: ${task.dueDate}</p>
        <p>Priority: ${task.priority}</p>
        <p>Category: ${task.category}<br><br></p>
        <button class="edit-button" data-task-id="${task.id}" style="background-color: green; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Edit</button>
        <button class="close-button" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Close</button>
        </div>
      `;
  
      popupContainer.innerHTML = popupContent.innerHTML;
      document.body.appendChild(popupContainer);
  
      document.body.classList.add('popup-open');
  
      $('.edit-button').on('click', function() {
        let taskId = parseInt($(this).attr('data-task-id'));
        editTask(taskId);
      });
  
      $('.close-button').on('click', function() {
        closePopup();
      });
    }
     // Check if the event listener is already attached before adding it
  if (!isExitButtonAttached) {
    $('.close-button').on('click', function() {
      closePopup();
    });
    isExitButtonAttached = true;
  }
  }
    
  function closePopup() {
    document.getElementById('taskPopupContainer').remove();
    document.body.classList.remove('popup-open');
  }

  function editTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let task = tasks.find(task => task.id === id);
  
    if (task) {
      closePopup();
      let editContainer = document.createElement('div');
      editContainer.id = 'editContainer';
      editContainer.innerHTML = `
        <h3 >Edit Task</h3>
        <form id="edit_form">
          <input type="text" id="edit_task_name" value="${task.name}" required>
          <textarea id="edit_task_details" required>${task.details}</textarea>
          <input type="date" id="edit_task_due_date" value="${task.dueDate}" required>
          <div class="custom-select">
            <select id="edit_task_priority" required>
              <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
            </select>
            <select id="edit_task_category" required>
              <option value="Personal" ${task.category === 'Personal' ? 'selected' : ''}>Personal</option>
              <option value="Work" ${task.category === 'Work' ? 'selected' : ''}>Work</option>
              <option value="Study" ${task.category === 'Study' ? 'selected' : ''}>Study</option>
              <option value="Other" ${task.category === 'Other' ? 'selected' : ''}>Other</option>
            </select>
            <button type="submit">Save</button>
            <button id="cancel_edit_button" style="background-color: #f44336; color: #fff;">Cancel</button>
            </div>
        </form>
      `
  
      document.body.appendChild(editContainer);
      document.getElementById('edit_form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveEditedTask(id);
      });
  
      document.getElementById('cancel_edit_button').addEventListener('click', function(event) {
        event.preventDefault();
        closeEditContainer();
      });
      
    }
  }
  function closeEditContainer() {
    let editContainer = document.getElementById('editContainer');
    if (editContainer) {
      editContainer.remove();
    }
  }
  
  function saveEditedTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskIndex = tasks.findIndex(task => task.id === id);
  
    if (taskIndex !== -1) {
      tasks[taskIndex].name = document.getElementById('edit_task_name').value;
      tasks[taskIndex].details = document.getElementById('edit_task_details').value;
      tasks[taskIndex].dueDate = document.getElementById('edit_task_due_date').value;
      tasks[taskIndex].priority = document.getElementById('edit_task_priority').value;
      tasks[taskIndex].category = document.getElementById('edit_task_category').value;
  
      localStorage.setItem('tasks', JSON.stringify(tasks));
      alert('Task updated');
      closeEditContainer();
      showTasks(tasks); 
    }
  }

  
  function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    showTasks(updatedTasks);
    updateCalendar(updatedTasks);
  }
  

  $(document).on('click', '#task_list button.delete-button', function(event) {
    event.stopPropagation();
    let taskId = parseInt($(this).attr('data-task-id'));
    deleteTask(taskId);
  });


  function showAllTasks(tasks) {
    tasks = tasks || JSON.parse(localStorage.getItem('tasks')) || [];
    let taskList = '';

    for (let task of tasks) {
      taskList += `
        <div style="text-align: center;">
          <h3>${task.name}</h3>
          <p>${task.details}</p>
          <p>Due date: ${task.dueDate}</p>
          <p>Priority: ${task.priority}</p>
          <p>Category: ${task.category}</p>
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
    exitButton.addEventListener('click', function() {
      popupContainer.style.display = 'none';
    });
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

  function updateTask(id, updatedTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskIndex = tasks.findIndex(task => task.id === id);
  
    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      alert('Task updated');
      showTasks(tasks); // Pass the updated tasks to showTasks function
      updateCalendar(tasks); // Pass the updated tasks to updateCalendar function
    }
  }

  function updateCalendar() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let events = tasks.map(task => {
      return {
        id: task.id,
        title: task.name,
        start: task.dueDate,
        color: getEventColor(task.priority)
      };
    });

    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('addEventSource', events);
    $('#calendar').fullCalendar('rerenderEvents');
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
    events: getTasksForCalendar()
  });

  function getTasksForCalendar() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let events = tasks.map(task => {
      return {
        id: task.id,
        title: task.name,
        start: task.dueDate,
        color: getEventColor(task.priority)
      };
    });

    return events;
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
});
