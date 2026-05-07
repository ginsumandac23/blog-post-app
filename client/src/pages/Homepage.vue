<script setup>
	import { onBeforeMount, reactive } from 'vue';
	import api from '../api';
	import { Notyf } from 'notyf';
	import { useGlobalStore } from '../stores/global';
	import { useRouter } from 'vue-router';

	const notyf = new Notyf();
	const store = useGlobalStore();
	const router = useRouter();

	const posts = reactive({
	  data: [],
	  isLoading: false
	});

	async function fetchMovies() {
	  try {
	    posts.isLoading = true;

	    const res = await api.get('/posts/');

	    posts.data = res.data
	      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
	      .slice(0, 6);

	  } catch (err) {
	    console.log('MOVIES ERROR:', err.response?.status, err.response?.data || err);
	    notyf.error('Failed to fetch posts');
	  } finally {
	    posts.isLoading = false;
	  }
	}

	function viewPost(postId) {
	  if (!store.user?.token && !store.user?.email) {
	    router.push('/login');
	  } else {
	    router.push(`/posts/${postId}`);
	  }
	}

	onBeforeMount(() => {
	  fetchMovies();
	});
</script>


<template>
	<section id="banner" class="d-flex align-items-center justify-content-center">
		<div class="container-xxl">
			<div class="row justify-content-center text-center">
				<div class="col-5">
					<div class="banner-text">
						<h1 class="py-3">EDITORIAL REVIEWS & INSIGHTS</h1>

						<h5>Where high-quality typography meets intentional storytelling.</h5>

						<p class="py-3">A minimalist space dedicated to creators, thinkers, and builders. We explore the intersection of digital craft and artistic prestige.</p>

						<div class="banner-divider mt-4">

						</div>
					</div>
				</div>
			</div>
		</div>
	</section>


	<section id="latest-post">
		<div class="container-xxl">
			<div class="row">
				<div class="latest-post-container">
					<h2 class="m-0">Latest Posts</h2>
					<hr />

					<div class="row post-card">

						<div 
							v-for="post in posts.data" 
							:key="post._id" 
							class="col-lg-4 col-md-6 col-sm-12">

							<div class="card my-2">
							  <img :src="post.image || '/images/demo-card.png'" class="card-img-top" alt="post card image">
							  <div class="card-body">
							    <h5 class="card-title">{{post.title}}</h5>
							    <!-- <h3 class="post-date">SEPTEMBER 12, 2025</h3> -->
							    <p class="card-text text-truncate-custom">{{post.content}}</p>
							    <button @click="viewPost(post._id)" class="btn btn-primary">View Post</button>
							  </div>
							</div>
						</div>

						

					</div>
				</div>
			</div>
		</div>
	</section>

</template>


<style>
	.text-truncate-custom {
	  display: -webkit-box;
	  -webkit-line-clamp: 1;
	  -webkit-box-orient: vertical;
	  overflow: hidden;
	}
</style>