const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("projectModal");

const form = document.getElementById("projectForm");
const submitButton = form.querySelector("button[type='submit']");

const projectsContainer = document.getElementById("projectsContainer");

let editingProjectId = null;


// ================= Open Modal =================

openModal.addEventListener("click", () => {

    editingProjectId = null;

    form.reset();

    submitButton.innerText = "Create Project";

    modal.classList.remove("hidden");
    modal.classList.add("flex");

});


// ================= Close Modal =================

closeModal.addEventListener("click", () => {

    modal.classList.remove("flex");
    modal.classList.add("hidden");

});


// ================= Load Projects =================

async function loadProjects() {

    const response = await fetch("/projects");

    const data = await response.json();

    projectsContainer.innerHTML = "";

    data.projects.forEach(project => {

        projectsContainer.innerHTML += `

        <div class="bg-white shadow rounded-lg p-5">

            <h2 class="text-2xl font-bold">${project.title}</h2>

            <p class="mt-2">
                <b>Stack:</b>
                ${project.stack}
            </p>

            <p class="mt-2">
                <b>Instruction:</b>
                ${project.instruction}
            </p>

            <p class="mt-2">
                <b>Deadline:</b>
                ${new Date(project.deadline).toLocaleDateString()}
            </p>

            <div class="mt-5 flex gap-3">

                <a
                    href="/projects/${project._id}/tasks"
                    class="bg-blue-600 text-white px-4 py-2 rounded">

                    View Tasks

                </a>

                <button
              onclick='editProject(
            ${JSON.stringify(project)}
            )'
            class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">

            Edit

            </button>

                <button
                    onclick="deleteProject('${project._id}')"
                    class="bg-red-600 text-white px-4 py-2 rounded">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

loadProjects();


// ================= Create / Update =================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = {

        title: form.title.value,
        stack: form.stack.value,
        instruction: form.instruction.value,
        deadline: form.deadline.value

    };

    let response;

    // UPDATE
    if (editingProjectId) {

        response = await fetch(`/projects/${editingProjectId}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(formData)

        });

    }

    // CREATE
    else {

        response = await fetch("/projects", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(formData)

        });

    }

    const data = await response.json();

    if (data.success) {

        editingProjectId = null;

        submitButton.innerText = "Create Project";

        form.reset();

        modal.classList.remove("flex");
        modal.classList.add("hidden");

        loadProjects();

    }

    else {

        alert(data.message);

    }

});


// ================= Edit =================

function editProject(project) {

    editingProjectId = project._id;

    form.title.value = project.title;
    form.stack.value = project.stack;
    form.instruction.value = project.instruction;
    form.deadline.value = project.deadline.split("T")[0];

    submitButton.innerText = "Update Project";

    modal.classList.remove("hidden");
    modal.classList.add("flex");

}


// ================= Delete =================

async function deleteProject(id) {

    const confirmDelete = confirm("Delete this project?");

    if (!confirmDelete) return;

    const response = await fetch(`/projects/${id}`, {

        method: "DELETE"

    });

    const data = await response.json();

    if (data.success) {

        loadProjects();

    }

    else {
        
        alert(data.message);

    }

}
window.editProject = editProject;
window.deleteProject = deleteProject;