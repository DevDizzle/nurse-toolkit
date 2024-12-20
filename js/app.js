// Load JSON resources and dynamically populate sections
fetch('resources.json')
    .then(response => response.json())
    .then(data => {
        const categories = {
            communication: document.getElementById('communication-resources'),
            cultural: document.getElementById('cultural-resources'),
            technology: document.getElementById('technology-resources'),
            training: document.getElementById('training-resources')
        };

        // Populate each category with resources
        data.resources.forEach(resource => {
            const resourceElement = document.createElement('div');
            resourceElement.innerHTML = `
                <h3><a href="${resource.url}" target="_blank">${resource.title}</a></h3>
                <p>${resource.summary}</p>
                <p class="citation">${resource.citation}</p>
            `;

            // Append to the appropriate category
            if (categories[resource.category]) {
                categories[resource.category].appendChild(resourceElement);
            }
        });
    })
    .catch(error => console.error('Error loading resources:', error));

// Implement search functionality
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', event => {
    const query = event.target.value.toLowerCase();

    // Clear current results
    Object.values(document.querySelectorAll('section div')).forEach(section => {
        section.innerHTML = '';
    });

    fetch('resources.json')
        .then(response => response.json())
        .then(data => {
            data.resources.forEach(resource => {
                if (
                    resource.title.toLowerCase().includes(query) ||
                    resource.summary.toLowerCase().includes(query)
                ) {
                    const resourceElement = document.createElement('div');
                    resourceElement.innerHTML = `
                        <h3><a href="${resource.url}" target="_blank">${resource.title}</a></h3>
                        <p>${resource.summary}</p>
                        <p class="citation">${resource.citation}</p>
                    `;

                    // Determine category placement
                    const category = resource.category || 'general';
                    const section = document.getElementById(`${category}-resources`);
                    section.appendChild(resourceElement);
                }
            });
        })
        .catch(error => console.error('Error during search:', error));
});
