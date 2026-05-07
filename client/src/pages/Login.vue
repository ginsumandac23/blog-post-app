<script setup>
	import { watch, ref, onMounted } from 'vue';
	import { Notyf } from 'notyf';
	import api from '../api';
	import { useRouter } from 'vue-router';
	import { useGlobalStore } from '../stores/global';

	const router = useRouter();
	const store = useGlobalStore();
	const notyf = new Notyf();

	onMounted(() => {
		if(store.user.email){
			router.push({path: "/"});
		}
	});

	//reactive
	const email = ref('');
	const password = ref('');
	const isEnabled = ref(false);
	const isLoading = ref(false);

	watch([email, password], (newVal) => {
		if(newVal.every(input => input != '')){
			isEnabled.value = true;
		}else {
			isEnabled.value = false;
		}
	})

	async function handleSubmitLogin(){

		try{

			isLoading.value = true;

			let response = await api.post("/users/login", {
				email: email.value,
				password: password.value
			})

			if(response.data){
				notyf.success("Login Successfully");

				localStorage.setItem("token", response.data.access);

				await store.getUserDetails(response.data.access);

				//reset 
				email.value = "";
				password.value = "";

				router.push({path: "/"});
			}

		}catch(err){
			if (err.response) {
			  const message =
			    err.response.data?.message ||
			    err.response.data?.error ||
			    "Invalid email or password";

			  notyf.error(message);
			} else {
			  notyf.error("Network error. Please try again.");
			}
		}finally {
			isLoading.value = false;
		}
	}
</script>


<template>
	<section id="login" class="d-flex align-items-center justify-content-center">
    <div class="container-xxl">
      <div class="row justify-content-center">
        
        <div class="col-lg-5">
          <div class="auth-box login-box p-4 rounded-4">
          	<img src="/images/logo.png" alt="login logo" class="logo-img text-center mx-auto d-block mb-3" />
            <h2 class="mb-2 text-center">Welcome Back</h2>
            <p class="text-center">Access your editorial workspace</p>

            <form @submit.prevent="handleSubmitLogin" class="pt-4">

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
				  Logging In...
				</span>
				<span v-else>LOGIN</span>
              </button>

            </form>

            <hr />
            <p class="text-center pt-3">Don't have account? <router-link :to="{name: 'Register'}" class="ps-1 auth-next-link">Register</router-link></p>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>