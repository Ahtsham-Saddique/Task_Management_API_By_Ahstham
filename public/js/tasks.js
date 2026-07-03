const openModal = document.getElementById("openTaskModal");
const closeModal = document.getElementById("closeTaskModal");

const modal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasksContainer");
const submitButton = taskForm.querySelector("button[type='submit']");

// Store the task currently being edited
let editingTaskId = null;

// ---------------- Open Modal ----------------

openModal.addEventListener("click", () => {

    editingTaskId = null;

    taskForm.reset();

    submitButton.innerText = "Create Task";

    modal.classList.remove("hidden");
    modal.classList.add("flex");

});

// ---------------- Close Modal ----------------

closeModal.addEventListener("click", () => {

    modal.classList.remove("flex");
    modal.classList.add("hidden");

});

// ---------------- Create / Update Task ----------------

taskForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const taskData = {

        taskName: taskForm.taskName.value,
        description: taskForm.description.value,
        completed: taskForm.completed.value === "true"

    };

    let response;

    // Update Task
    if (editingTaskId) {

        response = await fetch(`/tasks/${editingTaskId}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(taskData)

        });

    }

    // Create Task
    else {

        response = await fetch(`/tasks/${projectId}`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(taskData)

        });

    }

    const data = await response.json();

    if (data.success) {

        editingTaskId = null;

        taskForm.reset();

        modal.classList.remove("flex");
        modal.classList.add("hidden");

        loadTasks();

    }

    else {

        alert(data.message);

    }

});

// ---------------- Load Tasks ----------------

async function loadTasks() {

    const response = await fetch(`/tasks/${projectId}`);

    const data = await response.json();

    tasksContainer.innerHTML = "";

    data.tasks.forEach(task => {

        tasksContainer.innerHTML += `

<div class="bg-white p-5 rounded shadow">

    <h2 class="text-xl font-bold">
        ${task.taskName}
    </h2>

    <p class="mt-2">
        ${task.description}
    </p>

    <p class="mt-3">
        Status:
        ${task.completed ? "✅ Completed" : "⏳ Pending"}
    </p>

    <div class="mt-5 flex gap-3">

        <button
            onclick="editTask(
                '${task._id}',
                '${task.taskName.replace(/'/g, "\\'")}',
                '${task.description.replace(/'/g, "\\'")}',
                ${task.completed}
            )"
            class="bg-blue-600 text-white px-4 py-2 rounded">

            Edit

        </button>

        <button
            onclick="toggleTask('${task._id}', ${task.completed})"
            class="bg-yellow-500 text-white px-4 py-2 rounded">

            ${task.completed ? "Mark Pending" : "Mark Complete"}

        </button>

        <button
            onclick="deleteTask('${task._id}')"
            class="bg-red-600 text-white px-4 py-2 rounded">

            Delete

        </button>

    </div>

</div>

`;

    });

}

loadTasks();

// ---------------- Edit Task ----------------

function editTask(id, taskName, description, completed) {

    editingTaskId = id;

    taskForm.taskName.value = taskName;
    taskForm.description.value = description;
    taskForm.completed.value = completed.toString();
     submitButton.innerText = "Update Task";
    modal.classList.remove("hidden");
    modal.classList.add("flex");

}

// ---------------- Delete Task ----------------

async function deleteTask(taskId) {

    const confirmDelete = confirm("Delete this task?");

    if (!confirmDelete) return;

    const response = await fetch(`/tasks/${taskId}`, {

        method: "DELETE"

    });

    const data = await response.json();

    if (data.success) {

        loadTasks();

    }

    else {

        alert(data.message);

    }

}

// ---------------- Toggle Status ----------------

async function toggleTask(taskId, completed) {

    const response = await fetch(`/tasks/${taskId}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            completed: !completed

        })

    });

    const data = await response.json();

    if (data.success) {

        loadTasks();

    }

    else {

        alert(data.message);
        

    }

}