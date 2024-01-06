<template>
  <v-app-bar color="primary">
    <template v-slot:prepend> </template>
    <v-app-bar-title>FOOD RECIPE</v-app-bar-title>
    <template v-slot:append>
      <v-col>
        <v-btn @click="goToCreateRecipe" color="danger"> Create </v-btn>
      </v-col>
    </template>
  </v-app-bar>
</template>

<script>
import { useRouter } from "vue-router";  

export default {
  setup() {
    const router = useRouter(); 

    const goToCreateRecipe = () => {
      router.push("/create-recipe");
    };

    return {
      goToCreateRecipe,
    };
  },
};
</script>

<style lang="scss" scoped></style>
