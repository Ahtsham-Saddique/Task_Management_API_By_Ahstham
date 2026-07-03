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

            <button

                onclick="deleteUser('${user._id}')"

                class="bg-red-600 text-white px-5 py-2 rounded">

                Delete

            </button>

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

function viewTasks(id) {

    window.location = `/projects/${id}/tasks`;



}


<button

onclick="viewTasks('${project._id}')"

class="bg-blue-600 text-white px-5 py-2 rounded">

View Tasks

</button>