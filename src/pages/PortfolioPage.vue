<template>
  <NavBar />
  <v-container>
    <v-card>
      <v-card-title class="headline">Portfolio Management</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="openCreatePortfolioDialog">Add New Project</v-btn>

        <v-data-table
          :headers="headers"
          :items="portfolios"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.title="{ item }">
            <div class="d-flex align-center">
              <v-avatar class="mr-3" size="40">
                <img :src="item.image.url" alt="Project Image" />
              </v-avatar>
              <span>{{ item.title }}</span>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small @click="openEditPortfolioDialog(item)">mdi-pencil</v-icon>
            <v-icon small @click="deletePortfolio(item.id)" color="red">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ isEditing ? 'Edit Project' : 'Create Project' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="isEditing ? updatePortfolio() : createPortfolio()">
            <v-text-field v-model="portfolioForm.title" label="Title" required></v-text-field>
            <v-text-field v-model="portfolioForm.link" label="Link" required></v-text-field>
            <v-textarea v-model="portfolioForm.text" label="Description" rows="4" required></v-textarea>
            <v-file-input v-model="portfolioForm.image" label="Image" accept="image/*"></v-file-input>
            <v-btn color="primary" type="submit">{{ isEditing ? 'Update' : 'Create' }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../api/axios';
import NavBar from "@/components/NavBar.vue";

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Title', value: 'title' },
  { text: 'Description', value: 'text' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const portfolios = ref([]);
const dialog = ref(false);
const portfolioForm = ref({ title: '', text: '', link: '', image: null });
const isEditing = ref(false);
const currentPortfolioId = ref(null);

const fetchPortfolios = async () => {
  try {
    const response = await axios.get('/portfolio');
    portfolios.value = response.data.items;
  } catch (error) {
    console.error('Failed to fetch portfolios:', error);
  }
};

onMounted(() => {
  fetchPortfolios();
});

const openCreatePortfolioDialog = () => {
  portfolioForm.value = { title: '', text: '', link: '', image: null };
  isEditing.value = false;
  dialog.value = true;
};

const openEditPortfolioDialog = (portfolio) => {
  portfolioForm.value = {
    title: portfolio.title,
    link: portfolio.link,
    text: portfolio.text,
    image: null,
  };
  currentPortfolioId.value = portfolio.id;
  isEditing.value = true;
  dialog.value = true;
};

const createPortfolio = async () => {
  try {
    const formData = new FormData();
    formData.append('title', portfolioForm.value.title);
    formData.append('text', portfolioForm.value.text);
    formData.append('link', portfolioForm.value.link);
    if (portfolioForm.value.image) {
      formData.append('image', portfolioForm.value.image);
    }

    const response = await axios.post('/portfolio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    portfolios.value.push(response.data);
    dialog.value = false;
  } catch (error) {
    console.error('Failed to create portfolio project:', error);
  }
};

const updatePortfolio = async () => {
  try {
    const formData = new FormData();
    formData.append('title', portfolioForm.value.title);
    formData.append('text', portfolioForm.value.text);
    formData.append('link', portfolioForm.value.link);
    if (portfolioForm.value.image) {
      formData.append('image', portfolioForm.value.image);
    }

    const response = await axios.put(`/portfolio/${currentPortfolioId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const updatedPortfolioIndex = portfolios.value.findIndex((p) => p.id === currentPortfolioId.value);
    if (updatedPortfolioIndex !== -1) {
      portfolios.value[updatedPortfolioIndex] = response.data;
    }
    dialog.value = false;
  } catch (error) {
    console.error('Failed to update portfolio project:', error);
  }
};

const deletePortfolio = async (id) => {
  try {
    await axios.delete(`/portfolio/${id}`);
    portfolios.value = portfolios.value.filter((portfolio) => portfolio.id !== id);
  } catch (error) {
    console.error('Failed to delete portfolio project:', error);
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
  min-height: calc(100vh - 240px);
  width: 100vw;
}

.d-flex.align-center {
  display: flex;
  align-items: center;
}

img {
  width: 100%;
  height: auto;
}

.v-avatar {
  background-color: transparent;
}

.v-btn {
  margin-bottom: 10px;
}
</style>
