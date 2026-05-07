<script setup>
	import { onBeforeMount, reactive } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import * as bootstrap from 'bootstrap';
	import api from '../api';
	import { Notyf } from 'notyf';
	import { useGlobalStore } from '../stores/global';
	const router = useRouter();
	const route = useRoute();
	const notyf = new Notyf();
	const store = useGlobalStore();
	const post = reactive({
		data: null,
		isLoading: false
	});
	const editForm = reactive({
		title: '',
		content: ''
	});
	const commentForm = reactive({
		text: '',
		isSubmitting: false
	});

	function isOwner() {
	  if (!post.data || !store.user) return false;
	  const authorId = post.data.author?._id || post.data.author;
	  const userId = store.user._id || store.user.id;
	  return String(authorId) === String(userId);
	}

	function openEditModal() {
		editForm.title = post.data.title;
		editForm.content = post.data.content;
		const modal = new bootstrap.Modal(document.getElementById('editPostModal'));
		modal.show();
	}

	function openDeleteModal() {
		const modal = new bootstrap.Modal(document.getElementById('deletePostModal'));
		modal.show();
	}

	async function updatePost() {
		try {
			await api.patch(`/posts/update-post/${post.data._id}`, {
				title: editForm.title,
				content: editForm.content
			});
			post.data.title = editForm.title;
			post.data.content = editForm.content;
			notyf.success('Post updated successfully');
			const modal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
			modal.hide();
		} catch (err) {
			console.log(err);
			notyf.error('Failed to update post');
		}
	}

	async function fetchPost(){
	    try {
	        post.isLoading = true;
	        const response = await api.get(`/posts/${route.params.id}`);
	        post.data = response.data;
	    } catch(err){
	        notyf.error('Failed to fetch post');
	    } finally {
	        post.isLoading = false;
	    }
	}

	async function deletePost() {
	  try {
	    await api.delete(`/posts/${post.data._id}`);
	    notyf.success('Post deleted');
	    const modal = bootstrap.Modal.getInstance(document.getElementById('deletePostModal'));
	    modal.hide();
	    router.push('/blogs');
	  } catch (err) {
	    console.log(err);
	    notyf.error('Failed to delete post');
	  }
	}

	async function submitComment() {
		if (!commentForm.text.trim()) {
			notyf.error('Comment cannot be empty');
			return;
		}
		try {
			commentForm.isSubmitting = true;
			const response = await api.post(`/posts/comments/${post.data._id}`, {
				comment: commentForm.text
			});
			post.data.comments = response.data.comments;
			commentForm.text = '';
			notyf.success('Comment posted!');
		} catch (err) {
			console.log(err);
			notyf.error('Failed to post comment');
		} finally {
			commentForm.isSubmitting = false;
		}
	}

	function getCommentAuthor(comment) {
		return comment.user?.username || 'Unknown';
	}

	onBeforeMount(() => {
		fetchPost();
	});
</script>

<template>
	<section id="single-blog" class="py-5">
		<div class="container-xxl">
			<div class="row d-flex justify-content-center">
				<div class="col-md-6">
					<div class="single-post-container py-5" v-if="post.data">
						<h1 class="text-center">{{post.data.title}}</h1>
						<p class="pt-5">{{post.data.content}}</p>
						<div v-if="isOwner()" class="d-flex gap-2 mt-4 justify-content-end">
							<button 
								class="btn btn-warning"
								@click="openEditModal"
							>
								Update
							</button>
							<button 
								class="btn btn-danger"
								@click="openDeleteModal"
							>
								Delete
							</button>
						</div>
					</div>	
					
					<hr />

					<!-- Comment Input -->
					<div class="post-comment p-4 bg-white border rounded-3">
						<h2>Share your thoughts</h2>
						<div class="comment-box mt-3">
							<textarea 
								class="form-control mb-2" 
								rows="3" 
								placeholder="Write your comment..."
								v-model="commentForm.text"
							></textarea>
							<div class="d-flex justify-content-end">
								<button 
									class="btn btn-comment"
									@click="submitComment"
									:disabled="commentForm.isSubmitting"
								>
									{{ commentForm.isSubmitting ? 'Posting...' : 'Post Comment' }}
								</button>
							</div>
						</div>
					</div>

					<!-- Comment List -->
					<div class="comment-list mt-4" v-if="post.data && post.data.comments && post.data.comments.length">
						<h6 class="mb-3 text-muted">{{ post.data.comments.length }} Comment{{ post.data.comments.length !== 1 ? 's' : '' }}</h6>
						<div 
							v-for="c in post.data.comments" 
							:key="c._id" 
							class="comment-item mb-3 p-3 rounded"
						>
							<p class="mb-1">
								<strong>{{ getCommentAuthor(c) }}</strong>
							</p>
							<p class="mb-0">{{ c.comment }}</p>
						</div>
					</div>
					<div v-else-if="post.data" class="mt-4 text-muted text-center">
						<small>No comments yet. Be the first to share your thoughts!</small>
					</div>

				</div>
			</div>
		</div>
	</section>

	<!-- Edit Post Modal -->
	<div class="modal fade" id="editPostModal" tabindex="-1" aria-labelledby="editPostModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="editPostModalLabel">Edit Post</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label fw-semibold">Title</label>
						<input 
							type="text" 
							class="form-control" 
							v-model="editForm.title" 
						/>
					</div>
					<div class="mb-3">
						<label class="form-label fw-semibold">Content</label>
						<textarea 
							class="form-control" 
							rows="6" 
							v-model="editForm.content"
						></textarea>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-warning" @click="updatePost">Save Changes</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Delete Modal -->
	<div class="modal fade" id="deletePostModal" tabindex="-1" aria-labelledby="deletePostModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header border-0">
					<h5 class="modal-title" id="deletePostModalLabel">Delete Post</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body text-center py-4">
					<i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 2.5rem;"></i>
					<p class="mt-3 mb-0">Are you sure you want to delete this blog post?</p>
					<small class="text-muted">This action cannot be undone.</small>
				</div>
				<div class="modal-footer border-0 justify-content-center gap-2">
					<button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-danger px-4" @click="deletePost">Yes, Delete</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
	.single-post-container h1 {
		font-family: "Playfair", serif;
		font-weight: 600;
		font-size: 48px;
		color: var(--dark-text-heading);
	}
	.single-post-container p {
		font-size: 18px;
		line-height: 30px;
		color: #454652;
	}
	.post-comment h2{
		font-size: 16px;
	}
	.btn-comment {
		background: var(--primary-color);
		color: #fff;
		line-height: 36px;
		font-size: 14px;
	}
	.btn-comment:hover {
		border: 1px solid var(--primary-color);
	}
	.btn-comment:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.comment-box textarea, .comment-box .form-control:focus {
		background: #fff;
		color: #454652;
	}
	.comment-box textarea::placeholder {
		color: #aaa !important;
		opacity: 1;
	}
	.comment-item {
		background: #fff;
		border: 1px solid var(--primary-color);
		color: #454652;
	}
	.comment-item strong {
		color: var(--dark-text-heading);
	}
</style>