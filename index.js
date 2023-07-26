// Fonction pour générer la "card" d'une recette
function generateRecipeCard(recipe) {
    return `
        <li class="recipe-card">
            <img src="./assets/photos/${recipe.image}" alt="${recipe.name}" class="recipe-image" />
            <h2 class="recipe-name">${recipe.name}</h2>
            <p class="recipe-description">${recipe.description}</p>
            <h3 class="recipe-ingredients-heading">Ingrédients:</h3>
            <ul class="recipe-ingredients">
                ${recipe.ingredients.map(ingredient => `
                    <li>${ingredient.quantity} ${ingredient.unit || ''} ${ingredient.ingredient}</li>
                `).join('')}
            </ul>
        </li>
    `;
}

// Fonction pour afficher les "cards" des recettes
function displayRecipes() {
    const recipeContainer = document.querySelector('.recipes');

    recipes.forEach(recipe => {
        const recipeCardHTML = generateRecipeCard(recipe);
        recipeContainer.insertAdjacentHTML('beforeend', recipeCardHTML);
    });
}

// Appel de la fonction pour afficher les "cards" des recettes une fois que la page est chargée
document.addEventListener('DOMContentLoaded', displayRecipes);