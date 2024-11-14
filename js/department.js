// Fetch and display exhibits for a department or search query
async function loadExhibits() {
    const exhibitList = document.getElementById('exhibit-list');
    
    if (!exhibitList) {
        console.error("exhibit-list element not found");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('departmentId');
    const query = urlParams.get('query');
    const page = parseInt(urlParams.get('page')) || 1;

    let apiUrl;
    let title;

    if (departmentId) {
        apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}&hasImages=true`;
        title = "Department Exhibits";
    } else if (query) {
        apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query}`;
        title = "Search Results";
    }

    document.getElementById('page-title').textContent = title;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();  // This consumes the response body
        const totalItems = departmentId ? data.objectIDs : data.total;
        const itemsPerPage = 10;
        const offset = (page - 1) * itemsPerPage;

        exhibitList.innerHTML = ''; // Clear previous exhibits

        const pageItems = (totalItems ? data.objectIDs.slice(offset, offset + itemsPerPage) : []).slice(0, itemsPerPage);
        
        // Fetch each exhibit's details
        for (let objectId of pageItems) {
            const item = await fetchItemDetails(objectId); // Fetching details for each item
            addExhibitToPage(item);
        }

        // Update pagination
        setupPagination(page, Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
        console.error('Error fetching exhibits:', error);
    }
}

// Fetch details for each item by its object ID
async function fetchItemDetails(objectId) {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
    return await response.json(); // Consuming response here
}

// Add an exhibit item to the list in department.html
function addExhibitToPage(item) {
    const exhibitList = document.getElementById('exhibit-list');
    const col = document.createElement('div');
    col.classList.add('col-md-4', 'mb-4');
    col.innerHTML = `
        <div class="card">
            <img src="${item.primaryImageSmall}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.artistDisplayName || 'Unknown Artist'}</p>
                <a href="exhibit.html?objectId=${item.objectID}" class="btn btn-primary">View Details</a>
            </div>
        </div>
    `;
    exhibitList.appendChild(col);
}

// Setup pagination controls
function setupPagination(currentPage, totalPages) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
    if (currentPage === i) {
        pageItem.classList.add('active');
    }
    pageItem.innerHTML = `<a class="page-link" href="?${getPaginationURLParams(i)}">${i}</a>`;
        paginationControls.appendChild(pageItem);
    }
}

// Helper to build URL with pagination parameters
function getPaginationURLParams(page) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', page);
    return urlParams.toString();
}




// Call function once the page is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    loadExhibits(); 
});