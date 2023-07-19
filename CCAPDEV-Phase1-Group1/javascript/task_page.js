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

  updateTaskCounter();
});

function updateTaskCounter() {
  var taskCount = document.querySelectorAll('.task_entry').length;
  var taskCounter = document.querySelector('.header_text .counter');
  taskCounter.textContent = '(' + taskCount + ')';
}

//----------------------------------------EDIT ZONE--------------------------------------------------------

// Function to add a task entry
function addTaskEntry() {
  var taskList = document.getElementById('taskList');
  var newTaskEntry = document.createElement('div');
  newTaskEntry.className = 'task_entry';
  newTaskEntry.innerHTML = `
    <div class="task_status" contenteditable="true"> <i class="fa-solid fa-bars-progress"></i> Status </div><span class="line">| </span>
    <div class="task_name" contenteditable="true">  Name  </div> <span class="line">|</span>
    <div class="task_content" contenteditable="true">  Content </div> <span class="line">|</span>
    <div class="task_date" contenteditable="true">  <i class="fa-solid fa-calendar-days fa-sm"></i>   Date</div>  <span class="line">| </span>  
    <div class="task_priority" contenteditable="true"><i class="fa-solid fa-chart-simple fa-xs"></i>  Priority </div> <span class="line">| </span> 
    <div class="task_category" contenteditable="true"> <i class="fa-solid fa-user fa-sm"></i> Category</div>
  `;
  taskList.appendChild(newTaskEntry);

  // Update the task counter
  updateTaskCounter();
}

// Function to load existing tasks from the server
function loadTasks() {
  fetch('/tasks', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(tasks => {
    tasks.forEach(task => {
      // For each task, create an entry in the task list
      addTaskEntry(task);
    });
  })
  .catch(error => {
    console.error('An error occurred while loading the tasks:', error);
  });
}

// Call loadTasks when the page loads
window.addEventListener('DOMContentLoaded', (event) => {
  loadTasks();

  // Add a click event to the save button
  var saveButton = document.querySelector('.save_button');
  saveButton.addEventListener('click', saveTasks);
});

// Function to save tasks when the save button is clicked
function saveTasks() {
  var taskEntries = document.querySelectorAll('.task_entry');
  taskEntries.forEach(function(taskEntry) {
    var taskStatus = taskEntry.querySelector('.task_status').textContent.trim();
    var taskName = taskEntry.querySelector('.task_name').textContent.trim();
    var taskContent = taskEntry.querySelector('.task_content').textContent.trim();
    var taskDate = taskEntry.querySelector('.task_date').textContent.trim();
    var taskPriority = taskEntry.querySelector('.task_priority').textContent.trim();
    var taskCategory = taskEntry.querySelector('.task_category').textContent.trim();

    var taskData = {
      task_status: taskStatus,
      task_name: taskName,
      task_content: taskContent,
      task_date: taskDate,
      task_priority: taskPriority,
      task_category: taskCategory
    };

    var requestUrl = '/tasks';
    var requestMethod = 'POST';

    if (taskEntry.getAttribute('data-id')) {
      requestUrl += '/' + taskEntry.getAttribute('data-id');
      requestMethod = 'PUT';
    }

    fetch(requestUrl, {
      method: requestMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    .then(response => {
      if (response.ok) {
        console.log('Task added/updated successfully');
      } else {
        console.error('Failed to add/update task');
      }
    })
    .catch(error => {
      console.error('An error occurred while adding/updating the task:', error);
    });
  });
}


//----------------------------------------EDIT ZONE--------------------------------------------------------
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
  taskBoxDate.value = taskDate;
  taskBoxPriority.value = taskPriority;
  taskBoxCategory.value = taskCategory;
}

function deleteTaskEntry() {
  var selectedTaskEntry = document.querySelector('.task_entry.selected');
  
  if (selectedTaskEntry) {
    selectedTaskEntry.remove();

    // Clear the right box
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
    updateTaskCounter();
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
    
    var taskNameElement = selectedTaskEntry.querySelector('.task_name');
    var taskContentElement = selectedTaskEntry.querySelector('.task_content');
    var taskStatusElement = selectedTaskEntry.querySelector('.task_status');
    var taskDateElement = selectedTaskEntry.querySelector('.task_date');  
    var taskPriorityElement = selectedTaskEntry.querySelector('.task_priority');
    var taskCategoryElement = selectedTaskEntry.querySelector('.task_category');
      
    
      
    taskNameElement.textContent = taskBoxName.textContent;
    taskContentElement.textContent = taskBoxContent.textContent;
    taskStatusElement.textContent = taskBoxStatus;
    taskDateElement.textContent = convertToDateWorded(taskBoxDate);
    taskPriorityElement.textContent = taskBoxPriority;
    taskCategoryElement.textContent = taskBoxCategory;
    
    taskNameElement.style.color = "black";
    taskContentElement.style.color = "black";
    taskStatusElement.style.color = "black";
    taskDateElement.style.color = "black";
    taskPriorityElement.style.color = "black";
    taskCategoryElement.style.color = "black";
          
      // Change the color of the lines to black
    selectedTaskEntry.querySelectorAll('.line').forEach(function(line) {
      line.style.color = 'black';
    });


  }

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

var dateInput = document.getElementById('dateInput');
var dateWorded = document.getElementById('dateWorded');

dateInput.addEventListener('change', function() {
  var inputValue = dateInput.value;
  var wordedDate = convertToDateWorded(inputValue);
  dateWorded.textContent = wordedDate;
});
