import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import TaskDashboard from '../views/TaskDashboard.vue';
import TaskDetailView from '../views/TaskDetailView.vue';
import PerformanceView from '../views/PerformanceView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes = [
  { path: '/', name: 'home', component: TaskDashboard, meta: { requiresAuth: true } },
  { path: '/performance', name: 'performance', component: PerformanceView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/tasks/:id', name: 'task-detail', component: TaskDetailView, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('userToken');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    next('/');
  } else {
    next();
  }
});

export default router;