import {searchBar} from '../index.js'
import {filterRecipes} from '../index.js'

// Fonction pour ajouter des filtres à la recherche
export function addFilterToSearch(filter) {
    const hiddenSearchInput = document.getElementById('hiddenSearchInput');
    const currentValue = hiddenSearchInput.value;
    const searchString = searchBar.value.toLowerCase();

    // Ajouter le filtre à la valeur actuelle de la barre de recherche cachée
    const combinedValue = (currentValue ? currentValue + ' ' : '') + filter.toLowerCase();

    // Metter à jour la valeur du champ de recherche cachée
    hiddenSearchInput.value = combinedValue;

    // Metter à jour les résultats de la recherche
    filterRecipes(searchString + ' ' + combinedValue);
}