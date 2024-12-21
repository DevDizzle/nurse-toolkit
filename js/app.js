// js/app.js

// Constants for categories
const categories = {
    communication: document.getElementById('communication-resources'),
    cultural: document.getElementById('cultural-resources'),
    technology: document.getElementById('technology-resources'),
    training: document.getElementById('training-resources')
};

// Function to fetch and display resources
function loadResources() {
    fetch('data/resources.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayResources(data.resources);
        })
        .catch(error => {
            console.error('Error fetching resources:', error);
            displayErrorMessage();
        });
}

// Function to display resources in their respective categories
function displayResources(resources, query = '') {
    // Clear existing resources
    clearAllSections();

    resources.forEach(resource => {
        // Create resource element
        const resourceElement = createResourceElement(resource, query);

        // Append to the appropriate category
        if (categories[resource.category]) {
            categories[resource.category].appendChild(resourceElement);
        } else {
            console.warn(`Unknown category '${resource.category}' for resource titled '${resource.title}'`);
        }
    });

    // If no resources are displayed, show no results message
    if (resources.length === 0) {
        displayNoResults();
    }
}

// Function to create a resource HTML element with optional highlighting
function createResourceElement(resource, query = '') {
    const div = document.createElement('div');
    div.classList.add('resource');

    // Highlight search terms if query is provided
    const highlightedCitation = query ? highlightMatch(resource.citation, query) : resource.citation;

    div.innerHTML = `
        <p class="citation">${highlightedCitation}</p>
        <p class="summary">${resource.summary}</p>
    `;

    return div;
}

// Function to highlight matched search terms
function highlightMatch(text, query) {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Utility function to escape RegExp special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Function to clear all sections
function clearAllSections() {
    Object.values(categories).forEach(section => {
        section.innerHTML = '';
    });
}

// Function to display an error message if resources fail to load
function displayErrorMessage() {
    const main = document.querySelector('main');
    main.innerHTML = `<p class="error">Sorry, we couldn't load the resources at this time. Please try again later.</p>`;
}

// Function to handle search functionality
function setupSearch() {
    const searchBar = document.getElementById('search-bar');

    searchBar.addEventListener('input', debounce(event => {
        const query = event.target.value.trim().toLowerCase();
        performSearch(query);
    }, 300)); // Debounce delay of 300ms
}

// Function to perform search and display filtered resources
function performSearch(query) {
    fetch('data/resources.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const filteredResources = data.resources.filter(resource => {
                return (
                    resource.title.toLowerCase().includes(query) ||
                    resource.author.toLowerCase().includes(query) ||
                    resource.summary.toLowerCase().includes(query) ||
                    resource.citation.toLowerCase().includes(query) ||
                    resource.journal.toLowerCase().includes(query)
                );
            });

            displayResources(filteredResources, query);
        })
        .catch(error => {
            console.error('Error during search:', error);
            displayErrorMessage();
        });
}

// Function to display a "No Results" message
function displayNoResults() {
    const main = document.querySelector('main');
    main.innerHTML = `<p class="no-results">No resources found matching your search.</p>`;
}

// Debounce function to limit the rate of function execution
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadResources();
    setupSearch();
});
