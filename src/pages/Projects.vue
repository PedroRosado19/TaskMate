<template>
  <div class="container mt-4">

    <!-- Page Title -->
    <h2 class="text-center mb-4">Your Projects</h2>

    <!-- Create Project Section -->
    <div class="card mb-4 shadow">
      <div class="card-body">
        <h5 class="card-title">Create New Project</h5>

        <form @submit.prevent="addProject">
          <div class="row">
            <div class="col-md-5 mb-2">
              <input
                type="text"
                class="form-control"
                placeholder="Project Name"
                v-model="newProjectName"
                required
              />
            </div>

            <div class="col-md-5 mb-2">
              <input
                type="text"
                class="form-control"
                placeholder="Project Description"
                v-model="newProjectDescription"
                required
              />
            </div>

            <div class="col-md-2 mb-2 d-grid">
              <button class="btn btn-success">
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Search projects..."
        v-model="searchQuery"
      />
    </div>

    <!-- Projects List -->
    <div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="project in filteredProjects"
        :key="project.id"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ project.name }}</h5>
            <p class="card-text">{{ project.description }}</p>

            <div class="d-grid gap-2">
              <button
                class="btn btn-primary"
                @click="openProject(project.id)"
              >
                Open Tasks
              </button>

              <button
                class="btn btn-danger"
                @click="deleteProject(project.id)"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No projects message -->
      <div v-if="filteredProjects.length === 0" class="text-center">
        <p class="text-muted">No projects found.</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Projects",
  data() {
    return {
      newProjectName: "",
      newProjectDescription: "",
      searchQuery: "",
      projects: [
        {
          id: 1,
          name: "Sample Project",
          description: "This is a demo project"
        }
      ]
    }
  },
  computed: {
    filteredProjects() {
      return this.projects.filter(project =>
        project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    addProject() {
      if (this.newProjectName === "" || this.newProjectDescription === "") {
        alert("Please fill in all fields")
        return
      }

      const newProject = {
        id: Date.now(),
        name: this.newProjectName,
        description: this.newProjectDescription
      }

      this.projects.push(newProject)

      this.newProjectName = ""
      this.newProjectDescription = ""
    },

    deleteProject(id) {
      this.projects = this.projects.filter(project => project.id !== id)
    },

    openProject(id) {
      this.$router.push(`/tasks/${id}`)
    }
  }
}
</script>

<style scoped>
.card-title {
  font-weight: bold;
}

h2 {
  font-weight: bold;
}
</style>
