import {updateSearch} from '../index.js'
import {filterHiddenSearchRecipe} from '../index.js'

// Fonction pour mettre à jour les tags
export function updateTags() {
    const selectedFiltersContainer = document.querySelector('.tags');
    const hiddenSearchInput = document.getElementById('hiddenSearchInput');

    // Récupérer les éléments sélectionnés dans la liste de filtres
    const selectedFilters = document.querySelectorAll('.filter-item.selected');

    // Créer un tableau pour stocker les filtres sélectionnés
    const selectedFilterValues = [];

    selectedFilters.forEach((filter) => {
        const filterValue = filter.textContent;
        selectedFilterValues.push(filterValue);
    });

  // Ajouter les nouveaux tags au conteneur des tags sans effacer les précédents
  selectedFilterValues.forEach((filterValue) => {
    const newTag = document.createElement('div');
    newTag.className = 'tag';
    newTag.textContent = filterValue;

    // Créer un bouton de suppression pour le tag
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';


    // Ajouter un gestionnaire d'événements pour la suppression du tag
    deleteButton.addEventListener('click', () => {
        // Supprimer le tag du conteneur des tags
        selectedFiltersContainer.removeChild(newTag);

            // Metter à jour la recherche lorsque le tag est supprimé
            updateSearch();
            filterHiddenSearchRecipe();
    // Supprimer le filtre correspondant de la hiddensearchbar
    const filterToRemove = filterValue.toLowerCase();
    const currentHiddenSearchValue = hiddenSearchInput.value.toLowerCase();

    // Vérifier si le filtre à supprimer existe dans la hiddensearchbar
    if (currentHiddenSearchValue.includes(filterToRemove)) {
        // Supprimer uniquement le filtre correspondant
        const updatedHiddenSearchValue = currentHiddenSearchValue.replace(filterToRemove, '');

        hiddenSearchInput.value = updatedHiddenSearchValue.trim(); // Supprimer les espaces en excès

        // Déclencher la fonction de filtrage avec la nouvelle valeur de la hiddensearchbar
        filterHiddenSearchRecipe();
        updateSearch();
    }
});
        // Ajouter le bouton de suppression au tag
        newTag.appendChild(deleteButton);

        // Ajouter le tag au conteneur des tags
        selectedFiltersContainer.appendChild(newTag);
    });
}