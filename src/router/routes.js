// src/router/routes.js

function loadPage(page) {
  return () => import(`@/pages/${page}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadPage('Home')
  },
  {
    path: '/login',
    name: 'Login',
    component: loadPage('Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: loadPage('Register')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: loadPage('Projects')
  },
  {
    path: '/tasks/:projectId',
    name: 'Tasks',
    component: loadPage('Tasks'),
    props: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: loadPage('Settings')
  },
  {
    path: '/about',
    name: 'About',
    component: loadPage('About')
  }
]

export default routes
