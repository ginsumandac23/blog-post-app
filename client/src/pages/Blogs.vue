<script setup>
import { ref, onMounted, watch } from 'vue';
import * as bootstrap from 'bootstrap';
import { useGlobalStore } from '../stores/global';
import api from '../api';
import { useRouter } from 'vue-router';

const posts = ref([]);
const isLoading = ref(false);
const postToDelete = ref(null);

const router = useRouter();
const store = useGlobalStore();

function viewPost(postId) {
  if (!store.user?.token && !store.user?.email) {
    router.push('/login');
  } else {
    router.push(`/posts/${postId}`);
  }
}


async function getAllPost() {
  try {
    isLoading.value = true;
    const res = await api.get("/posts/");
    posts.value = res.data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } catch (err) {
    console.log("Error fetching posts:", err);
  } finally {
    isLoading.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function confirmDelete(post) {
  postToDelete.value = post;
  const modal = new bootstrap.Modal(document.getElementById('adminDeleteModal'));
  modal.show();
}

async function adminDeletePost() {
  try {
    await api.delete(`/posts/delete/${postToDelete.value._id}`);
    posts.value = posts.value.filter(p => p._id !== postToDelete.value._id);
    const modal = bootstrap.Modal.getInstance(document.getElementById('adminDeleteModal'));
    modal.hide();
    postToDelete.value = null;
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  getAllPost();
});
</script>

<template>
  <section id="posts" class="py-5">
    <div class="container-xxl">
      <div class="row">
        <div class="col-lg-12 posts-sec">
          <h1 class="pb-3">{{ store.user?.isAdmin ? 'Admin Dashboard' : 'Browse Blogs' }}</h1>

          <div class="all-posts pt-5">
            <div class="d-flex justify-content-end mb-3">
              <div class="sort-post position-relative">
                <select class="form-select sort-select">
                  <option value="">Sort Posts</option>
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="az">A - Z</option>
                  <option value="za">Z - A</option>
                </select>
                <i class="bi bi-filter sort-icon"></i>
              </div>
            </div>

            <div class="row post-card g-3" v-if="!store.user?.isAdmin">
              <div
                v-for="post in posts"
                :key="post._id"
                class="col-md-6 col-lg-3">
                <div class="card">
                  <img :src="post.image || '/images/demo-card.png'" class="card-img-top" alt="post card image">
                  <div class="card-body">
                    <h5 class="card-title">{{ post.title }}</h5>
                    <h3 class="post-date">{{ formatDate(post.createdAt) }}</h3>
                    <p class="card-text text-truncate-custom">{{ post.content }}</p>
                    <button @click="viewPost(post._id)" class="btn btn-primary">View Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Table -->
          <div class="admin-table-section" v-if="store.user?.isAdmin">
            <hr />
           
            <div class="table-responsive">
              <table class="table table-bordered table-hover align-middle">
                <thead class="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(post, index) in posts" :key="post._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ post.title }}</td>
                    <td>{{ formatDate(post.createdAt) }}</td>
                    <td class="text-center">
                      <router-link 
                        :to="`/posts/${post._id}`" 
                        class="btn btn-sm btn-outline-primary me-2"
                        title="View"
                      >
                        <i class="bi bi-eye"></i>
                      </router-link>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="confirmDelete(post)"
                        title="Delete"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- Admin Delete Confirmation Modal -->
  <div class="modal fade" id="adminDeleteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title">Delete Post</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center py-4">
          <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 2.5rem;"></i>
          <p class="mt-3 mb-1">Are you sure you want to delete:</p>
          <strong>{{ postToDelete?.title }}</strong>
          <p class="mt-2"><small class="text-muted">This action cannot be undone.</small></p>
        </div>
        <div class="modal-footer border-0 justify-content-center gap-2">
          <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger px-4" @click="adminDeletePost">Yes, Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .text-truncate-custom {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .admin-table-section h4 {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .admin-table-section td.content-cell {
	  max-width: 200px;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
</style>