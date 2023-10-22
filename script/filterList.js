import {uniqueItems} from '../index.js'

// Fonction pour mettre à jour la liste de filtres en fonction du type de filtre
export function updateFilterList(filterType, searchText = '') {
    // Effacer la liste de filtres actuelle
    const completeListContainer = document.querySelector('.filter-list-complete');
    const filteredListContainer = document.querySelector('.filter-list-filtered');
    completeListContainer.innerHTML = '';
    filteredListContainer.innerHTML = '';

    // Récupérer les filtres correspondants en fonction du type de filtre
    let filters = [];
    switch (filterType) {
        case 'ingredient':
            filters = uniqueItems.ingredient;
            break;
        case 'appliance':
            filters = uniqueItems.appliance;
            break;
        case 'ustensil':
            filters = uniqueItems.ustensil;
            break;
    }

    // Ajouter les filtres à la liste complète et filtrée
    filters.forEach(filter => {
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item visible';
        filterItem.textContent = filter;
        filterItem.setAttribute('data-filter-type', filterType);
        completeListContainer.appendChild(filterItem);

        // Vérifier si le filtre correspond à la recherche
        if (filter.toLowerCase().includes(searchText)) {
            const filteredItem = filterItem.cloneNode(true);
            filteredListContainer.appendChild(filteredItem);
        }
    });

    // Cacher ou afficher la liste complète en fonction de la recherche
    if (searchText === '') {
        completeListContainer.style.display = 'block';
        filteredListContainer.style.display = 'none';
    } else {
        completeListContainer.style.display = 'none';
        filteredListContainer.style.display = 'block';
    }
}