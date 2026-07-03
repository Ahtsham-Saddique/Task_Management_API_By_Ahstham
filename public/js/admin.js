const usersContainer = document.getElementById("usersContainer");

async function loadUsers() {

    const response = await fetch("/admin/users");

    const data = await response.json();

    usersContainer.innerHTML = "";

    data.users.forEach(user => {

        usersContainer.innerHTML += `

        <div class="bg-white rounded shadow p-5 flex justify-between items-center">

            <div>

                <h2 class="text-xl font-bold">

                    ${user.username}

                </h2>

                <p>${user.email}</p>

                <p>${user.role}</p>

            </div>

            <div class="flex gap-3">
                <button
                    onclick="viewUserProjects('${user._id}')"
                    class="bg-blue-600 text-white px-5 py-2 rounded">
                    View Projects
                </button>
                <button
                    onclick="deleteUser('${user._id}')"
                    class="bg-red-600 text-white px-5 py-2 rounded">
                    Delete
                </button>
            </div>


        </div>

        `;

    });

}

loadUsers();
async function loadProjects() {

    const response = await fetch("/admin/projects");

    const data = await response.json();

    const container = document.getElementById("projectsContainer");

    container.innerHTML = "";

    data.projects.forEach(project => {

        container.innerHTML += `

<div class="bg-white rounded shadow p-5">

<h2 class="text-2xl font-bold">

${project.title}

</h2>

<p>

Owner :

<b>

${project.owner.username}

</b>

</p>

<p>

${project.owner.email}

</p>

<p class="mt-3">

Stack :

${project.stack}

</p>

<p>

Deadline :

${new Date(project.deadline).toLocaleDateString()}

</p>

<div class="mt-5 flex gap-3">

<button

onclick="viewTasks('${project._id}')"

class="bg-blue-600 text-white px-5 py-2 rounded">

View Tasks

</button>

<button

onclick="deleteProject('${project._id}')"

class="bg-red-600 text-white px-5 py-2 rounded">

Delete

</button>

</div>

</div>

`;

    });

}

loadProjects();
async function deleteUser(id) {

    const confirmDelete = confirm("Delete this user?");

    if (!confirmDelete) return;

    const response = await fetch(`/admin/users/${id}`, {

        method: "DELETE"

    });

    const data = await response.json();

    if (data.success) {

        loadUsers();

    } else {

        alert(data.message);

    }

}


async function deleteProject(id) {

    if (!confirm("Delete this project?")) return;

    const response = await fetch(`/admin/projects/${id}`, {

        method: "DELETE"

    });

    const data = await response.json();

    if (data.success) {

        loadProjects();

    } else {

        alert(data.message);
        

    }

}

async function viewTasks(projectId) {

    const response = await fetch(`/admin/projects/${projectId}/tasks`);

    const data = await response.json();

    const projectsContainer = document.getElementById("projectsContainer");

    const userIdToProjectOwner = (data?.tasks && data.tasks.length > 0) ? "" : "";

    // Replace projectsContainer with a simple tasks list for the selected project

    if (!data.success) {








        alert(data.message || "Failed to load tasks");

        return;

    }

    const tasksHtml = data.tasks.map(task => `

        <div class="bg-white rounded shadow p-5">

            <h2 class="text-xl font-bold">${task.taskName}</h2>

            <p class="mt-2">${task.description || ""}</p>

            <p class="mt-3">Status: ${task.completed ? "✅ Completed" : "⏳ Pending"}</p>

            <div class="mt-5 flex gap-3">

                <button

                    onclick="deleteTask('${task._id}')"

                    class="bg-red-600 text-white px-4 py-2 rounded">

                    Delete

                </button>

            </div>

        </div>

    `).join("");

    projectsContainer.innerHTML = `

        <div class="flex items-center justify-between mb-6">

            <h2 class="text-3xl font-bold">Project Tasks</h2>

            <button

                onclick="location.reload()"

                class="bg-gray-700 text-white px-4 py-2 rounded">

                Back

            </button>

        </div>

        <div class="space-y-5">${tasksHtml}</div>

    `;

}

async function deleteTask(taskId) {

    if (!confirm("Delete this task?")) return;

    const response = await fetch(`/admin/tasks/${taskId}`, {

        method: "DELETE"

    });

    const data = await response.json();

    if (data.success) {

        // Reload current tasks view by triggering a projects reload

        loadProjects();

    } else {

        alert(data.message);

    }

}




