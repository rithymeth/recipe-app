// mutations.js
import gql from 'graphql-tag';

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($name: String, $imageUrl: String, $ingredients: [IngredientInput], $instructions: String) {
    createRecipe(name: $name, imageUrl: $imageUrl, ingredients: $ingredients, instructions: $instructions) {
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
