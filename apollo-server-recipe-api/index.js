import { prisma } from "./db.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";

(async function () {
  const typeDefs = gql`
    type Ingredient {
      id: String
      name: String
      quantity: String
      quantityType: String
    }

    type Recipe {
      id: String
      name: String
      instructions: String
      imageUrl: String
      createdDate: String
      updatedDate: String
      ingredients: [Ingredient]
    }

    type Query {
      getAllRecipes: [Recipe]
      getAllIngredients: [Ingredient]
    }

    type Mutation {
      createRecipe(
        name: String
        instructions: String
        imageUrl: String
        ingredients: [IngredientInput]
      ): Recipe
      createIngredient(
        name: String
        quantity: String
        quantityType: String
        recipeId: String
      ): Ingredient
    }

    input IngredientInput {
      name: String
      quantity: String
      quantityType: String
    }
  `;

  const resolvers = {
    Mutation: {
      createRecipe: async (_parent, args) => {
        const recipe = await prisma.recipe.create({
          data: {
            name: args.name,
            instructions: args.instructions,
            imageUrl: args.imageUrl,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            ingredients: {
              create: args.ingredients, // Assuming args.ingredients is an array
            },
          },
          include: {
            ingredients: true,
          },
        });
        return recipe;
      },
      createIngredient: async (_parent, args) => {
        const ingredient = await prisma.ingredient.create({
          data: {
            name: args.name,
            quantity: args.quantity,
            quantityType: args.quantityType,
            recipeId: args.recipeId,
          },
        });
        return ingredient;
      },
    },
    Query: {
      getAllRecipes: async () => {
        return await prisma.recipe.findMany({
          include: {
            ingredients: true,
          },
        });
      },
      getAllIngredients: async () => {
        return await prisma.ingredient.findMany();
      },
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 },
  });

  console.log("Server is ready at " + url);
})();



