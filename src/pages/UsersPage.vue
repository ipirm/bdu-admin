<template>
  <NavBar />
  <v-container>
    <v-card class="pa-4" color="surface">
      <v-card-title class="headline font-weight-bold" color="primary">User Management</v-card-title>
      <v-card-text>
        <v-btn color="secondary" dark class="mb-4" @click="openCreateUserDialog">
          <v-icon left>mdi-account-plus</v-icon>
          Add New User
        </v-btn>

        <v-data-table
          :headers="headers"
          :items="users"
          item-key="id"
          class="elevation-2"
          color="background"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" color="primary" @click="openEditUserDialog(item)">mdi-pencil</v-icon>
            <v-icon small color="error" @click="deleteUser(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ isEditing ? 'Edit User' : 'Create User' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="isEditing ? updateUser() : createUser()">
            <v-text-field v-model="userForm.name" label="Name" required></v-text-field>
            <v-text-field v-model="userForm.email" label="Email" type="email" required></v-text-field>
            <v-text-field v-model="userForm.password" label="Password" type="password" :required="!isEditing"></v-text-field>
            <v-btn color="primary" type="submit">{{ isEditing ? 'Update' : 'Create' }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from '../api/axios';
import NavBar from "@/components/NavBar.vue";

const showSnackbar = inject('showSnackbar');

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const users = ref([]);
const dialog = ref(false);
const userForm = ref({ name: '', email: '', password: '' });
const isEditing = ref(false);
const currentUserId = ref(null);

const fetchUsers = async () => {
  try {
    const response = await axios.get('/user');
    users.value = response.data.items;
  } catch (error) {
    showSnackbar('Failed to fetch users. Please try again later.', 'error');
  }
};

onMounted(() => {
  fetchUsers();
});

const openCreateUserDialog = () => {
  userForm.value = { name: '', email: '', password: '' };
  isEditing.value = false;
  dialog.value = true;
};

const openEditUserDialog = (user) => {
  userForm.value = { name: user.name, email: user.email };
  currentUserId.value = user.id;
  isEditing.value = true;
  dialog.value = true;
};

const createUser = async () => {
  try {
    const response = await axios.post('/user', userForm.value);
    users.value.push(response.data);
    dialog.value = false;
    showSnackbar('User successfully created!', 'success');
  } catch (error) {
    showSnackbar('Failed to create user. Please check your input and try again.', 'error');
  }
};

const updateUser = async () => {
  try {
    const response = await axios.put(`/user/${currentUserId.value}`, userForm.value);
    const updatedUserIndex = users.value.findIndex((u) => u.id === currentUserId.value);
    if (updatedUserIndex !== -1) {
      users.value[updatedUserIndex] = response.data;
    }
    dialog.value = false;
    showSnackbar('User successfully updated!', 'success');
  } catch (error) {
    showSnackbar('Failed to update user. Please try again later.', 'error');
  }
};

const deleteUser = async (id) => {
  try {
    await axios.delete(`/user/${id}`);
    users.value = users.value.filter((user) => user.id !== id);
    showSnackbar('User successfully deleted!', 'success');
  } catch (error) {
    showSnackbar('Failed to delete user. Please try again later.', 'error');
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
  min-height: calc(100vh - 260px);
}

.v-btn {
  margin-bottom: 10px;
  font-weight: bold;
}

</style>
