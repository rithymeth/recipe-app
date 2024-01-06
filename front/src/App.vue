<template>
  <v-app>
    <NavBar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/nav-bar.vue";

export default {
  name: "app",
  components: {
    NavBar,
  },
};
</script>

<style lang="scss" scoped></style>