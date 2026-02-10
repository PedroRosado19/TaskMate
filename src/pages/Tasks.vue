<template>
  <div class="container mt-4">

    <!-- Page Title -->
    <h2 class="text-center mb-4">Project Tasks</h2>

    <!-- Progress Bar -->
    <div class="mb-4">
      <label class="form-label">Project Progress</label>
      <div class="progress">
        <div
          class="progress-bar bg-success"
          role="progressbar"
          :style="{ width: progressPercentage + '%' }"
        >
          {{ progressPercentage }}%
        </div>
      </div>
    </div>

    <!-- Create Task -->
    <div class="card mb-4 shadow">
      <div class="card-body">
        <h5>Create New Task</h5>

        <form @submit.prevent="addTask">
          <div class="row">
            <div class="col-md-5 mb-2">
              <input
                type="text"
                class="form-control"
                placeholder="Task title"
                v-model="newTaskTitle"
                required
              />
            </div>

            <div class="col-md-5 mb-2">
              <input
                type="text"
                class="form-control"
                placeholder="Task description"
                v-model="newTaskDescription"
                required
              />
            </div>

            <div class="col-md-2 mb-2 d-grid">
              <button class="btn btn-primary">
                Add Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="task in tasks"
        :key="task.id"
      >
        <div class="card h-100 shadow-sm">

          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5 class="card-title">{{ task.title }}</h5>
              <input
                type="checkbox"
                v-model="task.completed"
              />
            </div>

            <p class="card-text">{{ task.description }}</p>

            <!-- Steps inside Task -->
            <h6>Steps</h6>
            <ul class="list-group mb-2">
              <li
                class="list-group-item"
                v-for="(step, index) in task.steps"
                :key="index"
              >
                <input
                  type="checkbox"
                  v-model="step.done"
                  class="me-2"
                />
                {{ step.text }}
              </li>
            </ul>

            <!-- Add Step -->
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                placeholder="Add a step..."
                v-model="task.newStep"
              />
              <button
                class="btn btn-outline-secondary"
                @click="addStep(task)"
              >
                Add
              </button>
            </div>

            <!-- Chat Placeholder -->
            <div class="border rounded p-2 bg-light">
              <strong>Task Chat (demo)</strong>
              <p class="small text-muted">
                Chat system placeholder for collaboration.
              </p>
            </div>

            <!-- Delete Task -->
            <div class="d-grid mt-2">
              <button
                class="btn btn-danger btn-sm"
                @click="deleteTask(task.id)"
              >
                Delete Task
              </button>
            </div>

          </div>

        </div>
      </div>

      <div v-if="tasks.length === 0" class="text-center">
        <p class="text-muted">No tasks yet. Create one above.</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Tasks",
  props: ["projectId"],
  data() {
    return {
      newTaskTitle: "",
      newTaskDescription: "",
      tasks: [
        {
          id: 1,
          title: "Sample Task",
          description: "This is a demo task",
          completed: false,
          newStep: "",
          steps: [
            { text: "First step", done: false },
            { text: "Second step", done: false }
          ]
        }
      ]
    }
  },
  computed: {
    progressPercentage() {
      if (this.tasks.length === 0) return 0
      const completed = this.tasks.filter(t => t.completed).length
      return Math.round((completed / this.tasks.length) * 100)
    }
  },
  methods: {
    addTask() {
      if (this.newTaskTitle === "" || this.newTaskDescription === "") {
        alert("Please fill in all fields")
        return
      }

      const newTask = {
        id: Date.now(),
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        completed: false,
        newStep: "",
        steps: []
      }

      this.tasks.push(newTask)
      this.newTaskTitle = ""
      this.newTaskDescription = ""
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id)
    },

    addStep(task) {
      if (task.newStep === "") return

      task.steps.push({
        text: task.newStep,
        done: false
      })

      task.newStep = ""
    }
  }
}
</script>

<style scoped>
.card-title {
  font-weight: bold;
}

.progress {
  height: 25px;
}

.progress-bar {
  font-weight: bold;
}
</style>
