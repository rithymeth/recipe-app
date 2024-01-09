import { createApp, provide, h } from "vue";
import "./style.css";
import App from "./App.vue";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
//vuetify
import '@mdi/font/css/materialdesignicons.css';
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
//route
import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/pages/Home.vue";
import CreateRecipe from "./components/pages/CreateRecipe.vue";
import Detail from "./components/pages/Detail.vue";


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light'
  }
});

const routes = [
  { path: "/", component: Home },
  { path: "/create-recipe", component: CreateRecipe },
  { path: "/detail/:id", component: Detail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: "https://apollo-recipe-api-ce0549082988.herokuapp.com/graphql",
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});
app.use(router);
app.use(vuetify);
app.mount("#app");
