import {updateRecipeCount} from './script/recipeCard.js'
import {updateTags} from './script/updateTags.js'
import {updateFilterList} from './script/filterList.js'
import {addFilterToSearch} from './script/addFilterToSearch.js'

// Fonction pour générer les "cards" des recettes
function generateRecipeCard(recipe) {
    return `
        <li class="recipe-card">
            <img src="./assets/photos/${recipe.image}" alt="${recipe.name}" class="recipe-image" />
            <h2 class="recipe-name">${recipe.name}</h2>
            <p class="recipe-heading">RECETTE</p>
            <p class="recipe-description">${recipe.description}</p>

            <h3 class="recipe-ingredients-heading">INGRÉDIENTS</h3>
            <div class="recipe-ingredients-grid">
                ${recipe.ingredients.map(ingredient => `
                    <div class="ingredient">
                        <div class="ingredient-name">${ingredient.ingredient}</div>
                        ${ingredient.quantity ? `<div class="ingredient-quantity">${ingredient.quantity} ${ingredient.unit || ''}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            <p class="recipe-appliance">Appareil : ${recipe.appliance}</p>
            <p class="recipe-ustensils">Ustensiles : ${recipe.ustensils.join(', ')}</p>
            <p class="recipe-time">${recipe.time} min</p>
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

    // Mettre à jour le compteur
    updateRecipeCount();
}

// Appel de la fonction pour afficher les "cards" des recettes une fois que la page est chargée
document.addEventListener('DOMContentLoaded', displayRecipes);

// Fonction pour filtrer les recettes en fonction des mots-clés
export function filterRecipes(searchString) {
    const recipeContainer = document.querySelector('.recipes');
    recipeContainer.innerHTML = '';

    const keywords = searchString.trim().toLowerCase().split(/\s+/);

    const filteredRecipes = recipes.filter(recipe => {
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()).join(' ');
        const ustensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase()).join(' ');
        const appliances = recipe.appliance.toLowerCase();

        return keywords.every(keyword => {
            return (
                recipeName.includes(keyword) ||
                recipeDescription.includes(keyword) ||
                ingredients.includes(keyword) ||
                ustensils.includes(keyword) ||
                appliances.includes(keyword)
            );
        });
    });

    // Vérifier si aucune recette ne correspond à la recherche
    if (filteredRecipes.length === 0) {
        // Afficher le message d'erreur avec des suggestions de recherche
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Aucune recette ne contient '${searchString}', vous pouver chercher 'tarte aux pommes', 'poisson', etc.`;
        errorMessage.className = 'error-message';
        recipeContainer.appendChild(errorMessage);
    } else {
        // Afficher les recettes filtrées normalement
        filteredRecipes.forEach(recipe => {
            const recipeCardHTML = generateRecipeCard(recipe);
            recipeContainer.insertAdjacentHTML('beforeend', recipeCardHTML);
        });
        // Une fois les recettes filtrées mises à jour, extraire les mots-clés des nouvelles cartes de recettes
        extractKeywordsFromRecipeCards();
    }

    // Metter à jour le compteur
    updateRecipeCount();
}

// Const pour le nombre minimum de caractères dans la barre de recherche
const MINIMUM_INPUT_NUMBER = 3;

// Listener pour la saisie dans la barre de recherche
export const searchBar = document.querySelector('.form input');
searchBar.addEventListener('input', (event) => {
    const searchString = event.target.value;
    if (searchString.length >= MINIMUM_INPUT_NUMBER || searchString.length === 0) {
        const hiddenSearchString = hiddenSearchInput.value.toLowerCase();
        const combinedSearchString = searchString + ' ' + hiddenSearchString;
        filterRecipes(combinedSearchString);
    }
});

// Fonction permettant de collecter des objets uniques (ingrédients, appareils, ustensiles) dans le tableau des recettes
function collectUniqueItems() {
    const uniqueItems = {
        ingredient: [],
        appliance: [],
        ustensil: [],
    };
    recipes.forEach(recipe => {
        // Collecter des ingrédients uniques
        recipe.ingredients.forEach(ingredient => {
            const ingredientName = ingredient.ingredient.toLowerCase();
            if (!uniqueItems.ingredient.includes(ingredientName)) {
                uniqueItems.ingredient.push(ingredientName);
            }
        });
        // Collecter des appareils uniques
        const applianceName = recipe.appliance.toLowerCase();
        if (!uniqueItems.appliance.includes(applianceName)) {
            uniqueItems.appliance.push(applianceName);
        }
        // Collectionner des ustensiles uniques
        recipe.ustensils.forEach(ustensil => {
            const ustensilName = ustensil.toLowerCase();
            if (!uniqueItems.ustensil.includes(ustensilName)) {
                uniqueItems.ustensil.push(ustensilName);
            }
        });
    });
    return uniqueItems;
}

// Appeler la fonction pour collecter les  unique items
export const uniqueItems = collectUniqueItems();

// const de filter buttons, filter list, et hidden search input
const filterButtons = document.querySelectorAll('.filter-button');
const filterList = document.querySelector('.filter-list');
const hiddenSearchInput = document.getElementById('hiddenSearchInput');
const selectedIngredients = [];
// Fonction pour générer la liste de filtres en fonction des cartes de recettes affichées
function generateFilterList(filterType) {
    const filterListContainer = document.querySelector('.filter-list');
    const uniqueKeywords = collectUniqueKeywords(filterType);

    // Efface la liste de filtres existante
    filterListContainer.innerHTML = '';

    // Crée la barre de recherche
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'filter-search';
    searchInput.setAttribute('data-filter-type', filterType);

    // Ajoute une classe pour définir l'icône de loupe comme fond
    searchInput.classList.add('search-icon');

    // Ajoute l'élément input à votre document
    document.body.appendChild(searchInput);

    // Ajoute un gestionnaire d'événements pour la barre de recherche
    searchInput.addEventListener('input', function () {
        filterListBySearch(filterType, this.value.toLowerCase());
    });

    // Ajoute la barre de recherche à la liste de filtres
    filterListContainer.appendChild(searchInput);

    // Crée un filtre pour chaque mot-clé unique
    uniqueKeywords.forEach(keyword => {
        let displayKeyword = keyword;
        let keywordType = '';

        // Vérifie le type de mot-clé et affichez le préfixe correspondant
        if (keyword.startsWith('ustensiles :')) {
            displayKeyword = keyword.replace('ustensiles :', '').trim();
            keywordType = 'ustensil';
        } else if (keyword.startsWith('appareil :')) {
            displayKeyword = keyword.replace('appareil :', '').trim();
            keywordType = 'appliance';
        } else {
            keywordType = 'ingredient';
        }

        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item';
        filterItem.textContent = displayKeyword;
        filterItem.setAttribute('data-filter-type', keywordType);

        // Ajoute un gestionnaire d'événements pour filtrer les recettes lorsqu'un filtre est cliqué
        filterItem.addEventListener('click', () => {
            filterRecipes(displayKeyword);
        });

        filterListContainer.appendChild(filterItem);
    });
}

// Ajoute un gestionnaire d'événements à chaque bouton
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filterType = this.getAttribute('data-filter');

        // Vérifie si la liste est déjà affichée
        if (filterList.style.display === 'block') {
            // Si elle est déjà affichée, on ferme
            filterList.style.display = 'none';
        } else {
            // Sinon, génère et afficher la liste
            generateFilterList(filterType);
            filterList.style.display = 'block';
        }
    });
});

// ajout d'un click event listeners aux éléments de la liste de filtrage et mettre à jour les tableaux sélectionnés
filterList.addEventListener('click', function(event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('filter-item')) {
        const filterType = clickedElement.getAttribute('data-filter-type');
        const selectedFilter = clickedElement.textContent;

        // Vérifie si le filtre est déjà sélectionné
        if (selectedIngredients.includes(selectedFilter)) {
            // S'il est déjà sélectionné, le supprimer
            removeFilterFromSearch(selectedFilter);
        } else {
            // S'il n'est pas sélectionné, l'ajouter
            addFilterToSearch(selectedFilter);
        }
        // Vérifie si le filtre est déjà sélectionné
        if (clickedElement.classList.contains('selected')) {
            // S'il est déjà sélectionné, le supprimer
            clickedElement.classList.remove('selected');
        } else {
            // S'il n'est pas sélectionné, l'ajouter
            clickedElement.classList.add('selected');
        }

        // Metter à jour les tags
        updateTags();
        filterList.style.display = 'none';
    }
});

// ajout d'une référence aux boutons de filtre par ID
const ingredientButton = document.querySelector('[data-filter-type="ingredient"]');
const applianceButton = document.querySelector('[data-filter-type="appliance"]');
const ustensilButton = document.querySelector('[data-filter-type="ustensil"]');

// Ajoute un gestionnaire d'événements à chaque bouton
ingredientButton.addEventListener('click', function() {
    showFilterList('ingredient');
});

applianceButton.addEventListener('click', function() {
    showFilterList('appliance');
});

ustensilButton.addEventListener('click', function() {
    showFilterList('ustensil');
});

// Fonction pour afficher la liste déroulante en fonction du type de filtre
function showFilterList(filterType) {
    // Positionne la liste déroulante en dessous du bouton cliqué
    const buttonRect = document.querySelector(`[data-filter-type="${filterType}"]`).getBoundingClientRect();
    filterList.style.position = 'absolute';
    filterList.style.left = buttonRect.left + 'px';
    filterList.style.top = (buttonRect.bottom + window.scrollY) + 'px';

    // Met à jour la liste de filtres en fonction du type de filtre
    updateFilterList(filterType);

    // Affiche la liste déroulante
    filterList.style.display = 'block';
}

// Fonction pour mettre à jour la recherche
export function updateSearch() {
    const searchString = searchBar.value.toLowerCase();
    const hiddenSearchString = hiddenSearchInput.value.toLowerCase();
    const combinedSearchString = searchString + ' ' + hiddenSearchString;
    filterRecipes(combinedSearchString);
}

// Fonction pour filtrer les recettes en fonction des mots-clés pour la barre de recherche cachée
export function filterHiddenSearchRecipe() {
    const hiddenSearchInput = document.getElementById('hiddenSearchInput');
    const searchString = hiddenSearchInput.value.toLowerCase();

    // Appeler la fonction filterRecipes en utilisant la valeur de la barre de recherche cachée
    filterRecipes(searchString);
}

// Attender que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Appeler la fonction pour extraire les mots-clés des cartes de recettes
    extractKeywordsFromRecipeCards();
});

// Fonction pour extraire les mots-clés des cartes de recettes
function extractKeywordsFromRecipeCards() {
    const keywords = [];

    // Sélectionner les éléments des cartes de recettes
    const recipeCards = document.querySelectorAll('.recipe-card');

    // Parcourer les cartes de recettes
    recipeCards.forEach(recipeCard => {
        // Extraire les mots-clés de chaque carte et les ajouter au tableau
        const ingredientElements = recipeCard.querySelectorAll('.ingredient-name');
        const ustensilElements = recipeCard.querySelectorAll('.recipe-ustensils');

        // Obtener les mots-clés à partir des éléments HTML
        const ingredients = Array.from(ingredientElements).map(element => element.textContent.toLowerCase());
        const ustensils = Array.from(ustensilElements).map(element => element.textContent.toLowerCase());

        // Ajouter les mots-clés de cette recette au tableau des mots-clés
        keywords.push(...ingredients, ...ustensils);
    });

    // Les mots-clés actuellement présents dans les cartes de recettes sont maintenant stockés dans le tableau "keywords"
    console.log(keywords);
}


// Fonction pour collecter les ustensiles, appareils et ingrédients uniques à partir des recettes affichées
function collectUniqueKeywords(filterType) {
    const uniqueKeywords = new Set();

    // Parcourer les recettes affichées et collecter les mots-clés uniques en fonction du type de filtre
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(recipeCard => {
        let keywords = [];

        switch (filterType) {
            case 'ingredient':
                keywords = Array.from(recipeCard.querySelectorAll('.ingredient-name')).map(ingredient => ingredient.textContent.toLowerCase());
                break;
            case 'ustensil':
                keywords = recipeCard.querySelector('.recipe-ustensils').textContent.toLowerCase().split(',').map(ustensil => ustensil.trim());
                break;
            case 'appliance':
                const appliance = recipeCard.querySelector('.recipe-appliance').textContent.toLowerCase();
                keywords.push(appliance);
                break;
        }

        keywords.forEach(keyword => {
            if (keyword.length >= MINIMUM_INPUT_NUMBER) {
                uniqueKeywords.add(keyword);
            }
        });
    });

    return Array.from(uniqueKeywords);
}

function filterListBySearch(filterType, searchString) {
    const filterItems = document.querySelectorAll(`.filter-item[data-filter-type="${filterType}"]`);

    filterItems.forEach(filterItem => {
        const keyword = filterItem.textContent.toLowerCase();

        // Vérifier si le mot-clé correspond au texte de recherche
        if (keyword.includes(searchString)) {
            filterItem.classList.remove('hidden');
        } else {
            filterItem.classList.add('hidden');
        }
    });
}