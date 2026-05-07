//Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'

// Main CSS
import './assets/main.css'

//NoTyf
import 'notyf/notyf.min.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'


//import for router
import Homepage from './pages/Homepage.vue';
import Register from './pages/Register.vue';
import Login from './pages/Login.vue';
import Logout from './pages/Logout.vue';
import Blogs from './pages/Blogs.vue';
import BlogPost from './pages/BlogPost.vue';
import AddBlogPost from './pages/AddBlogPost.vue';



import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "Home",
			component: Homepage
		},
		{
			path: "/register",
			name: "Register",
			component: Register
		},
		{
			path: "/login",
			name: "Login",
			component: Login
		},
		{
			path: "/logout",
			name: "Logout",
			component: Logout
		},
		{
			path: "/blogs",
			name: "Blogs",
			component: Blogs
		},
		{
			path: "/posts/:id",
			component: BlogPost
		},
		{
			path: "/create-blog",
			name: "CreateBlog",
			component: AddBlogPost
		}
	]
})



const app = createApp(App);

app.use(createPinia());

app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value();
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
});

app.use(router);

app.mount('#app')
