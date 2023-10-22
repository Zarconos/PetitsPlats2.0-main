// Fonction pour mettre à jour le compteur
export function updateRecipeCount() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    const recipeCountElement = document.getElementById('recipeCount');
    const recipeCount = recipeCards.length;
    recipeCountElement.textContent = `${recipeCount} recettes`;
}

