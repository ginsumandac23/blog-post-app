<script setup>
	import { watch, ref } from 'vue';
	import { Notyf } from 'notyf';
	import api from '../api';
	import { useRouter } from 'vue-router';

	const router = useRouter();

	//reactive
	const username = ref('');
	const email = ref('');
	const password = ref('');
	const isEnabled = ref(false);
	const isLoading = ref(false);

	const notyf = new Notyf();

	watch([username, email, password], (newVal) => {
		if (newVal.every(input => input !== '')) {
			isEnabled.value = true;
		} else {
			isEnabled.value = false;
		}
	});

	async function handleSubmitReg(){

		try {

			isLoading.value = true;
			const response = await api.post("/users/register", {
				username: username.value,
				email: email.value,
				password: password.value
			})

			if(response.status === 201){
				notyf.success("Registered Successfully");

				//reset
				username.value = '';
				email.value = '';
				password.value = '';

				router.push({path: "/login"});
			}

		}catch(err){
			if(err.response.status === 404 || err.response.status === 401 || err.response.status === 400 || err.response.status === 409 ) {
				notyf.error(err.response.data.message);
			}else {
				console.err(err);
				notyf.error("Registration failed. Please contact administrator.")
			}

		}finally {
			isLoading.value = false;
		}
	}
</script>

<template>
	<section id="register" class="d-flex align-items-center justify-content-center">
	  <div class="container-xxl">
	    <div class="row justify-content-center">
	      
	      <div class="col-lg-5">
	        <div class="auth-box p-4 rounded-4">
	          <h2 class="mb-2 text-center">Join GineBlog</h2>
	          <p class="text-center">Elevate your editorial journey in a space designed for creators.</p>

	          <form @submit.prevent="handleSubmitReg" class="pt-4">


	          	<!-- Username -->
	            <div class="form-group mb-3">
	              <label class="form-label">Username</label>
	              <div class="position-relative">
	                <i class="bi bi-person input-icon"></i>
	                <input 
	                  type="text" 
	                  class="form-control custom-input" 
	                  placeholder="Enter your username"
	                  v-model="username"
	                >
	              </div>
	            </div>


	            <!-- Email -->
	            <div class="form-group mb-3">
	              <label class="form-label">Email Address</label>
	              <div class="position-relative">
	                <i class="bi bi-envelope input-icon"></i>
	                <input 
	                  type="email" 
	                  class="form-control custom-input" 
	                  placeholder="Enter your email"
	                  v-model="email"
	                >
	              </div>
	            </div>

	            <!-- Password -->
	            <div class="form-group mb-4">
	              <label class="form-label">Password</label>
	              <div class="position-relative">
	                <i class="bi bi-lock input-icon"></i>
	                <input 
	                  type="password" 
	                  class="form-control custom-input" 
	                  placeholder="Enter your password"
	                  v-model="password"
	                >
	              </div>
	            </div>

	            <button type="submit" class="btn btn-auth w-100" :disabled="!isEnabled || isLoading">
	            	  <span v-if="isLoading">
	            	   <span class="spinner-border spinner-border-sm me-2"></span>
	            	   Creating Account...
	            	 </span>
	            	 <span v-else>REGISTER</span>
	            </button>

	          </form>

	          <hr />
	          <p class="text-center pt-3">Already have an account? <router-link :to="{name:'Login'}" class="ps-1 auth-next-link">Login</router-link></p>

	        </div>
	      </div>

	    </div>
	  </div>
	</section>
</template>