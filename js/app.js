// js/app.js

// Function to fetch and display resources
function loadResources() {
    fetch('data/resources.json') // Updated path to resources.json
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            populateSections(data.resources);
        })
        .catch(error => console.error('Error loading resources:', error));
}

// Function to populate sections with resources
function populateSections(resources) {
    const categories = {
        communication: document.getElementById('communication-resources'),
        cultural: document.getElementById('cultural-resources'),
        technology: document.getElementById('technology-resources'),
        training: document.getElementById('training-resources')
    };

    resources.forEach(resource => {
        const resourceElement = createResourceElement(resource);

        // Append to the appropriate category
        if (categories[resource.category]) {
            categories[resource.category].appendChild(resourceElement);
        } else {
            // Handle resources with undefined categories
            console.warn(`Unknown category '${resource.category}' for resource '${resource.title}'`);
        }
    });
}

// Function to create a resource HTML element
function createResourceElement(resource) {
    const div = document.createElement('div');
    div.classList.add('resource');

    div.innerHTML = `
        <h3><a href="${resource.url}" target="_blank" rel="noopener noreferrer">${resource.title}</a></h3>
        <p>${resource.summary}</p>
        <p class="citation">${resource.citation}</p>
    `;

    return div;
}

// Function to handle search functionality
function setupSearch() {
    const searchBar = document.getElementById('search-bar');

    searchBar.addEventListener('input', debounce(event => {
        const query = event.target.value.toLowerCase();

        // Clear current results
        clearSections();

        // Fetch and filter resources based on the search query
        fetch('data/resources.json') // Updated path to resources.json
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const filteredResources = data.resources.filter(resource => {
                    return (
                        resource.title.toLowerCase().includes(query) ||
                        resource.summary.toLowerCase().includes(query) ||
                        resource.citation.toLowerCase().includes(query) // Include citation in search
                    );
                });

                populateSections(filteredResources);
            })
            .catch(error => console.error('Error during search:', error));
    }, 300)); // Debounce delay of 300ms
}

// Function to clear all sections
function clearSections() {
    const sections = document.querySelectorAll('main section div');
    sections.forEach(section => {
        section.innerHTML = '';
    });
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
