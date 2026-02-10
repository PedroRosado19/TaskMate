<template>
  <div class="container mt-4">

    <div class="card shadow">
      <div class="card-body text-center">

        <img
          src="@/assets/taskmate-logo.png"
          alt="TaskMate Logo"
          width="100"
          class="mb-3"
        />

        <h2>About TaskMate</h2>
        <p class="text-muted fs-5">
          Helping You Stay on Track
        </p>

        <hr />

        <p>
          TaskMate is a task and project management application designed to help
          users organise their work efficiently. It allows you to create projects,
          add tasks, break tasks into steps, and track progress visually.
        </p>

        <p>
          This application was developed as part of the CT216 coursework project.
          It demonstrates:
        </p>

        <ul class="list-group mb-3">
          <li class="list-group-item">Vue.js Routing</li>
          <li class="list-group-item">JavaScript Objects and Arrays</li>
          <li class="list-group-item">Functions and Event Handling</li>
          <li class="list-group-item">Bootstrap UI Design</li>
          <li class="list-group-item">Dynamic UI Updates</li>
        </ul>

        <p class="mt-3">
          Version: 1.0.0
        </p>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "About"
}
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
