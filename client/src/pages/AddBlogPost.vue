<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { Notyf } from 'notyf';

const router = useRouter();
const notyf = new Notyf();

const formData = reactive({
	title: '',
	content: ''
});

const isLoading = reactive({
	submit: false
});

async function createPost() {

	try {

		isLoading.submit = true;

		const response = await api.post('/posts/addPost', {
			title: formData.title,
			content: formData.content
		});

		notyf.success('Blog post created successfully');

		console.log(response.data);

		router.push('/blogs');

	} catch(err) {

		console.log(err);

		notyf.error('Failed to create blog post');

	} finally {

		isLoading.submit = false;

	}
}
</script>

<template>
	<section id="create-post" class="py-5">
		<div class="container-xxl">
			<div class="row justify-content-center">

				<div class="col-lg-8">

					<div class="create-post-card p-4 rounded-4">

						<h1 class="mb-4">Create Blog Post</h1>

						<form @submit.prevent="createPost">

							<div class="mb-3">
								<label class="form-label">
									Title
								</label>

								<input 
									v-model="formData.title"
									type="text" 
									class="form-control"
									placeholder="Enter blog title"
									required
								/>
							</div>

							<div class="mb-4">
								<label class="form-label">
									Content
								</label>

								<textarea 
									v-model="formData.content"
									class="form-control"
									rows="8"
									placeholder="Write your blog content..."
									required
								></textarea>
							</div>

							<div class="d-flex justify-content-end">
								<button 
									type="submit"
									class="btn btn-create"
									:disabled="isLoading.submit"
								>

									<span v-if="isLoading.submit">
										Creating...
									</span>

									<span v-else>
										Create Post
									</span>

								</button>
							</div>

						</form>

					</div>

				</div>

			</div>
		</div>
	</section>
</template>

<style scoped>

#create-post {
	min-height: 100vh;
}

.create-post-card {
	background: #ffffff;
	border: 1px solid #e5e7eb;
	box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.create-post-card h1 {
	font-size: 36px;
	font-weight: 700;
	color: #111827;
}

.form-label {
	font-weight: 600;
	color: #374151;
}

.form-control {
	border-radius: 12px;
	padding: 12px;
}

.form-control:focus {
	box-shadow: none;
	border-color: #269cda;
}

.btn-create {
	background: #269cda;
	color: #fff;
	padding: 10px 24px;
	border-radius: 10px;
	border: none;
	font-weight: 600;
}

.btn-create:hover {
	background: #1f87bd;
	color: #fff;
}

.btn-create:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

</style>