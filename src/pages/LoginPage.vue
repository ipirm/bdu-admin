<template>
  <v-container class="login-container" fill-height>
    <v-row
      justify="center"
      align="center"
    >
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                class="mt-4"
                @click="handleLogin"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {inject, ref} from 'vue';
import { useRouter } from 'vue-router';
import axios from '../api/axios';

const email = ref('');
const password = ref('');
const router = useRouter();
const showSnackbar = inject('showSnackbar');

const handleLogin = async () => {
  try {
    const response = await axios.post(
      '/auth/login',
      {
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    const token = response.data.access_token;

    localStorage.setItem('authToken', token);

    await router.push('/users');
  } catch (error) {
    console.error('Login failed:', error);
    showSnackbar('Login failed');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}
</style>
