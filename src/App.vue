<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import {ref, provide} from 'vue';

const snackbar = ref({
  show: false,
  message: '',
  color: 'error',
});

const showSnackbar = (message, color = 'error') => {
  snackbar.value = {
    show: true,
    message,
    color,
  };
};

provide('showSnackbar', showSnackbar);
</script>

<style scoped>
</style>
