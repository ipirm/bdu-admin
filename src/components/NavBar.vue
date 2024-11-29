<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Admin Panel</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text to="/users" :exact="$route.path === '/users'" color="white">
      Users
    </v-btn>
    <v-btn text to="/portfolio" :exact="$route.path === '/portfolio'" color="white">
      Portfolio
    </v-btn>
    <v-btn text @click="logout" color="white">
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
};
</script>

<style scoped>
.v-btn {
  margin-right: 10px;
}
</style>
