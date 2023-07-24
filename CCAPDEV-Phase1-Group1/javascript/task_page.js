document.addEventListener('DOMContentLoaded', function() {
  var addButton = document.querySelector('.add_task');
  addButton.addEventListener('click', addTaskEntry);

  var taskList = document.getElementById('taskList');
  taskList.addEventListener('click', function(event) {
  
  var taskEntry = event.target.closest('.task_entry');
    if (taskEntry) {
      displayTask(taskEntry);
    }
  });

  var saveButton = document.querySelector('.save_button');
  saveButton.addEventListener('click', updateTaskEntry);

  var deleteButton = document.querySelector('.delete_button');
  deleteButton.addEventListener('click', deleteTaskEntry);
  
  loadTasks();
  updateTaskCounter();
  
});


function updateTaskCounter() {
  var taskCount = document.querySelectorAll('.task_entry').length;
  var taskCounter = document.querySelector('.header_text .counter');
  taskCounter.textContent = '(' + taskCount + ')';
}

// Function to load tasks from the server and display them
async function loadTasks() {
  const taskList = document.getElementById('taskList');

  try {
    // Fetch tasks from the server
    const response = await fetch('/api/tasks');
    const tasks = await response.json();

    // Create task entries and add them to the taskList
    tasks.forEach((task) => {
      const newTaskEntry = document.createElement('div');
      newTaskEntry.className = 'task_entry';
      newTaskEntry.setAttribute('data-task-id', task._id); // Set the _id as a custom attribute
      newTaskEntry.innerHTML = `
        <div class="task_status"> <i class="fa-solid fa-bars-progress"></i> ${task.task_status} </div><span class="line">| </span>
        <div class="task_name">  ${task.task_name}  </div> <span class="line">|</span>
        <div class="task_content">  ${task.task_content} </div> <span class="line">|</span>
        <div class="task_date">  <i class="fa-solid fa-calendar-days fa-sm"></i> ${convertToDateWorded(task.task_date)}</div>  <span class="line">| </span>  
        <div class="task_priority"><i class="fa-solid fa-chart-simple fa-xs"></i> ${task.task_priority} </div> <span class="line">| </span> 
        <div class="task_category"> <i class="fa-solid fa-user fa-sm"></i> ${task.task_category}</div>
      `;
      newTaskEntry.style.hover = "cursor: pointer";
      
      taskList.appendChild(newTaskEntry);
    });

    updateTaskCounter();
 
  } catch (error) {
    console.error('An error occurred while fetching tasks:', error);
  }
}

function addTaskEntry() {
  var taskList = document.getElementById('taskList');
  var newTaskEntry = document.createElement('div');
  newTaskEntry.className = 'task_entry';
  newTaskEntry.innerHTML = `
    <div class="task_status"> <i class="fa-solid fa-bars-progress"></i> Status </div><span class="line">| </span>
    <div class="task_name">  Name  </div> <span class="line">|</span>
    <div class="task_content">  Content </div> <span class="line">|</span>
    <div class="task_date">  <i class="fa-solid fa-calendar-days fa-sm"></i>   July 23, 2023 </div>  <span class="line">| </span>  
    <div class="task_priority"><i class="fa-solid fa-chart-simple fa-xs"></i>  Priority </div> <span class="line">| </span> 
    <div class="task_category"> <i class="fa-solid fa-user fa-sm"></i> Category</div>
  `;
  taskList.appendChild(newTaskEntry);

  // Add click event listener to the newly added task entry
  newTaskEntry.addEventListener('click', function(event) {
    displayTask(event.currentTarget);
  });

  // Add pointer cursor style to the new task entry
  newTaskEntry.style.color = 'gray';
  newTaskEntry.style.cursor = "pointer";
  // Update the task counter
  updateTaskCounter();

   // Extract the task details from the new task entry
   var taskStatus = "Status"; 
   var taskName = "Name"; 
   var taskContent = "Content"; 
   var taskDate = "2023-07-23";
   var taskPriority = "Priority"; 
   var taskCategory = "Category"; 
 
   // Create a JSON object with the task details
   const newTask = {
     task_status: taskStatus,
     task_name: taskName,
     task_content: taskContent,
     task_date: taskDate,
     task_priority: taskPriority,
     task_category: taskCategory,
   };
 
   // Send a POST request to your server to add the task to the database
   fetch('/api/tasks', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(newTask),
   })
   .then((response) => response.json())
   .then((data) => {
    //TODO: look into this comment more
     newTaskEntry.setAttribute('data-task-id', data._id);
   })
   .catch((error) => {
     // Handle any errors that occurred during the POST request
     console.error('An error occurred while adding the task:', error);
     // If there's an error, you might want to remove the newTaskEntry to keep the frontend and backend in sync.
     newTaskEntry.remove();
    });

}


function displayTask(taskEntry) {
  var taskEntries = document.querySelectorAll('.task_entry');
  

  // Remove the 'selected' class from all task entries
  taskEntries.forEach(function(entry) {
    entry.classList.remove('selected');
  });

  // Add the 'selected' class to the clicked task entry
  taskEntry.classList.add('selected');

  var taskStatus = taskEntry.querySelector('.task_status').textContent.trim();
  var taskName = taskEntry.querySelector('.task_name').textContent.trim();
  var taskContent = taskEntry.querySelector('.task_content').textContent.trim();
  var taskDate = taskEntry.querySelector('.task_date').textContent.trim();
  var taskPriority = taskEntry.querySelector('.task_priority').textContent.trim();
  var taskCategory = taskEntry.querySelector('.task_category').textContent.trim();

  var taskBoxName = document.querySelector('.task_box_name');
  var taskBoxContent = document.querySelector('.task_box_content');
  var taskBoxStatus = document.querySelector('#task_status_id');
  var taskBoxDate = document.querySelector('#task_due_date');
  var taskBoxPriority = document.querySelector('#task_priority_id');
  var taskBoxCategory = document.querySelector('#task_category_id');

  taskBoxName.textContent = taskName;
  taskBoxContent.textContent = taskContent;
  taskBoxStatus.value = taskStatus;
  taskBoxDate.value = convertToISODate(taskDate);
  taskBoxPriority.value = taskPriority;
  taskBoxCategory.value = taskCategory;
  
}

function deleteTaskEntry() {
  var selectedTaskEntry = document.querySelector('.task_entry.selected');
  
  if (selectedTaskEntry) {
    var taskId = selectedTaskEntry.getAttribute("data-task-id");

    // Send the DELETE request to your server to remove the task from the database
    fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
    .then((response) => {
      if (response.ok) {
        // Task successfully deleted from the database
        selectedTaskEntry.remove(); // Remove the task entry from the DOM
        // Clear the right box if needed
        var taskBoxName = document.querySelector('.task_box_name');
        var taskBoxContent = document.querySelector('.task_box_content');
        var taskBoxStatus = document.querySelector('#task_status_id');
        var taskBoxDate = document.querySelector('#task_due_date');
        var taskBoxPriority = document.querySelector('#task_priority_id');
        var taskBoxCategory = document.querySelector('#task_category_id');

        taskBoxName.textContent = '';
        taskBoxContent.textContent = '';
        taskBoxStatus.value = '';
        taskBoxDate.value = '';
        taskBoxPriority.value = '';
        taskBoxCategory.value = '';

        // Update the task counter
        
        // Handle the response from the server if needed
        console.log('Task deleted:', response);
        updateTaskCounter();
      } else {
        console.error('Failed to delete the task.');
      }
    })
    .catch((error) => {
      console.error('Error while deleting the task:', error);
    });
  } else {
    console.error('No task selected to delete.');
  }
}

function updateTaskEntry() {
  var taskBoxName = document.querySelector('.task_box_name');
  var taskBoxContent = document.querySelector('.task_box_content');
  var taskBoxStatus = document.querySelector('#task_status_id').value;
  var taskBoxDate = document.querySelector('#task_due_date').value;
  var taskBoxPriority = document.querySelector('#task_priority_id').value;
  var taskBoxCategory = document.querySelector('#task_category_id').value;

  var selectedTaskEntry = document.querySelector('.task_entry.selected'); // Get the selected task entry

  if (selectedTaskEntry) {
    var taskId = selectedTaskEntry.getAttribute("data-task-id");

    // Extract the icons from the existing task entry
    var taskStatusIcon = selectedTaskEntry.querySelector('.fa-bars-progress');
    var taskDateIcon = selectedTaskEntry.querySelector('.fa-calendar-days');
    var taskPriorityIcon = selectedTaskEntry.querySelector('.fa-chart-simple');
    var taskCategoryIcon = selectedTaskEntry.querySelector('.fa-user');

    // Update the specific text content of the task entry
    selectedTaskEntry.querySelector('.task_name').textContent = taskBoxName.textContent;
    selectedTaskEntry.querySelector('.task_content').textContent = taskBoxContent.textContent;
    selectedTaskEntry.querySelector('.task_status').textContent = taskBoxStatus;
    selectedTaskEntry.querySelector('.task_date').textContent = convertToDateWorded(taskBoxDate);
    selectedTaskEntry.querySelector('.task_priority').textContent = taskBoxPriority;
    selectedTaskEntry.querySelector('.task_category').textContent = taskBoxCategory;

    // Re-insert the icons into the task entry
    selectedTaskEntry.querySelector('.task_status').prepend(taskStatusIcon);
    selectedTaskEntry.querySelector('.task_date').prepend(taskDateIcon);
    selectedTaskEntry.querySelector('.task_priority').prepend(taskPriorityIcon);
    selectedTaskEntry.querySelector('.task_category').prepend(taskCategoryIcon);

    selectedTaskEntry.style.color = 'black';
    // Send the updated task data to the server using fetch API
    var updatedTask = {
      task_name: taskBoxName.textContent,
      task_content: taskBoxContent.textContent,
      task_status: taskBoxStatus,
      task_date: taskBoxDate,
      task_priority: taskBoxPriority,
      task_category: taskBoxCategory
    };

    fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
    .then((response) => response.json())
    .then((updatedTask) => {
      // Handle the response from the server if needed
      alert("Task updated!")
      console.log('Task updated:', updatedTask);
      // You can update the UI here or show a success message if required
    })
    .catch((error) => {
      console.error('Error updating task:', error);
    });
  } else {
    console.error('No task selected to update.');
  }
}

function convertToISODate(dateString) {
  var dateObject = new Date(Date.parse(dateString));
  var year = dateObject.getFullYear();
  var month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, add 1 and pad with 0 if needed
  var day = dateObject.getDate().toString().padStart(2, '0'); // Pad with 0 if needed

  return year + '-' + month + '-' + day;
}


function convertToDateWorded(dateValue) {
  // Create a Date object using the input value
  var dateObject = new Date(dateValue);

  // Get the day, month, and year from the Date object
  var day = dateObject.getDate();
  var month = dateObject.getMonth() + 1; // Months are zero-based
  var year = dateObject.getFullYear();

  // Create an array of month names
  var monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  // Generate the worded equivalent of the date
  var dateWorded = monthNames[month - 1] +" "+ day + ","  + " " + year;

  return dateWorded;
}
/*
var dateInput = document.getElementById('dateInput');
var dateWorded = document.getElementById('dateWorded');

dateInput.addEventListener('change', function() {
  var inputValue = dateInput.value;
  var wordedDate = convertToDateWorded(inputValue);
  dateWorded.textContent = wordedDate;
}); */
