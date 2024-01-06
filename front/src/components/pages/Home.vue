<template>
  <div>
    <v-row v-if="isLoading">
      <v-col>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="selectedRecipe">
        <v-btn @click="goBack" color="primary">
          {{ createOrBackButtonText }}
        </v-btn>
        <v-card class="recipe-card">
          <v-img :src="selectedRecipe.imageUrl" aspect-ratio="2.5"></v-img>
          <v-card-title>{{ selectedRecipe.name }}</v-card-title>
          <v-card-text>
            <v-data-table-virtual :headers="headers" :items="selectedRecipe.ingredients" height="auto">
              <template #default="{ item }">
                <tr>
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.quantityType }}</td>
                </tr>
              </template>
            </v-data-table-virtual>
          </v-card-text>
          <v-card-title>{{ selectedRecipe.instructions }}</v-card-title>
        </v-card>
      </v-col>
      <v-col v-else v-for="recipe in recipes" :key="recipe.id">
        <v-card class="recipe-card" @click="selectRecipe(recipe.id)">
          <v-img :src="recipe.imageUrl" aspect-ratio="2.5"></v-img>
          <v-card-title>{{ recipe.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-if="error" type="error">{{ error.message }}</v-alert>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useRouter } from "vue-router";

const router = useRouter();

const getAllRecipe = gql`
  query {
    getAllRecipes {
      id
      name
      imageUrl
      ingredients {
        id
        name
        quantity
        quantityType
      }
      instructions
    }
  }
`;

const { result, isLoading, error } = useQuery(getAllRecipe);
const recipes = computed(() => result.value?.getAllRecipes ?? []);
const selectedRecipeId = ref(null);
const selectedRecipe = computed(() => recipes.value.find(recipe => recipe.id === selectedRecipeId.value));
const totalRecipes = computed(() => recipes.value.length);

const pagination = ref({
  page: 1,
  per: 10,
  length: Math.ceil(totalRecipes.value / 10),
});

watchEffect(() => {
  pagination.value.length = Math.ceil(totalRecipes.value / pagination.value.per);
});

const headers = [
  { text: "Name", value: "name" },
  { text: "Quantity", value: "quantity" },
  { text: "Quantity Type", value: "quantityType" },
];

const createOrBackButtonText = computed(() => {
  return selectedRecipe.value ? "Back" : "Create";
});

const goBack = () => {
  if (selectedRecipe.value) {
    // If a recipe is selected, go back to the list view
    selectedRecipeId.value = null;
  } else {
    // If no recipe is selected, navigate to the create recipe page
    router.push("/create-recipe");
  }
};

const selectRecipe = (recipeId) => {
  selectedRecipeId.value = recipeId;
};
</script>

<style lang="scss" scoped>
.recipe-card {
  width: 80%;
  margin: 20px auto;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
