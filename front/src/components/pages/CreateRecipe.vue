<template>
  <v-form @submit.prevent="createRecipe">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="recipeName" label="Recipe Name" required></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-model="imageUrl" label="Image URL"></v-text-field>
        </v-col>
      </v-row>

      <!-- Ingredients Input Fields -->
      <v-row v-for="(ingredient, index) in ingredients" :key="index">
        <v-col>
          <v-text-field v-model="ingredient.name" label="Ingredient Name" :rules="required" required></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="ingredient.quantity" label="Quantity" :rules="required" required></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="ingredient.quantityType" label="Quantity Type" :rules="required" required></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="removeIngredient(index)" color="error">Remove</v-btn>
        </v-col>
      </v-row>

      <!-- Button to Add Ingredient -->
      <v-btn @click="addIngredient" color="primary">Add Ingredient</v-btn>

      <v-row>
        <v-col cols="12">
          <v-textarea v-model="instructions" label="Instructions"></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-data-table :headers="ingredientHeaders" :items="ingredients" item-key="id">
            <template #item="{ item }">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.quantityType }}</td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn type="submit" color="primary">Create Recipe</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useRouter } from "vue-router";

const router = useRouter();

const createRecipeMutation = gql`
  mutation Mutation(
    $name: String
    $imageUrl: String
    $ingredients: [IngredientInput]
    $instructions: String
  ) {
    createRecipe(
      name: $name
      imageUrl: $imageUrl
      ingredients: $ingredients
      instructions: $instructions
    ) {
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
      createdDate
      updatedDate
    }
  }
`;

const { mutate } = useMutation(createRecipeMutation);

const recipeName = ref("");
const imageUrl = ref("");
const instructions = ref("");
const ingredients = ref([]);

const required = [(v) => !!v || "This field is required"];

const ingredientHeaders = [
  { text: "Name", value: "name" },
  { text: "Quantity", value: "quantity" },
  { text: "Quantity Type", value: "quantityType" },
];

const addIngredient = () => {
  ingredients.value.push({ name: "", quantity: "", quantityType: "" });
};

const removeIngredient = (index) => {
  ingredients.value.splice(index, 1);
};

const createRecipe = async () => {
  const recipeInput = {
    name: recipeName.value,
    imageUrl: imageUrl.value,
    instructions: instructions.value,
    ingredients: ingredients.value,
  };

  try {
    const { data } = await mutate(recipeInput);
    router.push(`/detail/${data.createRecipe.id}`);
  } catch (error) {
    console.error("Error creating recipe:", error.message);
  }
};
</script>
