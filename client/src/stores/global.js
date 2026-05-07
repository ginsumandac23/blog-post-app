import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api.js'

export const useGlobalStore = defineStore('global', () => {
  let user = reactive({
      token: localStorage.getItem('token'),
      id: null,
      email: null,
      isAdmin: false,
      isLoading: false
  })

  async function getUserDetails(token) {
  if (!token) {
    user.token = null;
    user.id = null;
    user.email = null;
    return;
  }

  user.isLoading = true;

  try {
    const { data } = await api.get('/users/details');

    console.log('DETAILS RESPONSE:', data);

    user.token = token;
    user.id = data._id;       
    user.email = data.email;     
    user.isAdmin = data.isAdmin; 

  } catch (err) {
    console.error(err);

    user.id = null;
    user.token = null;
    user.email = null;

    localStorage.removeItem('token');

  } finally {
    user.isLoading = false;
  }
}


  return {
    user,
    getUserDetails
  }
});