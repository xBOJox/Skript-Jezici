// Fetch departments from the Met Museum API and populate the dropdown
async function loadDepartments() {
    try {
        const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
        const data = await response.json();
        
        const departmentSearchInput = document.getElementById('department-search'); // Search input field
        const suggestionsDropdown = document.getElementById('search-suggestions'); // Dropdown for suggestions
        
        // Function to filter and show department suggestions
        const showDepartmentSuggestions = (query) => {
            suggestionsDropdown.innerHTML = ''; // Clear any previous suggestions
            if (query.length > 0) {
                // Filter departments based on the input query
                const filteredDepartments = data.departments.filter(department => 
                    department.displayName.toLowerCase().includes(query.toLowerCase())
                );
                
                filteredDepartments.forEach(department => {
                    const suggestionItem = document.createElement('a');
                    suggestionItem.classList.add('dropdown-item');
                    suggestionItem.href = `department.html?departmentId=${department.departmentId}`;
                    suggestionItem.textContent = department.displayName;

                    // Add event listener for clicking on a suggestion
                    suggestionItem.addEventListener('click', function () {
                        window.location.href = suggestionItem.href; // Redirect to the department page
                    });

                    suggestionsDropdown.appendChild(suggestionItem);
                });

                suggestionsDropdown.style.display = 'block'; // Show the dropdown
            } else {
                suggestionsDropdown.style.display = 'none'; // Hide dropdown if no query
            }
        };

        // Event listener for input changes
        departmentSearchInput.addEventListener('input', (event) => {
            const query = event.target.value;
            showDepartmentSuggestions(query);
        });

        // Hide the suggestions if the user clicks outside the search box
        document.addEventListener('click', (event) => {
            if (!departmentSearchInput.contains(event.target) && !suggestionsDropdown.contains(event.target)) {
                suggestionsDropdown.style.display = 'none';
            }
        });

    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

// Call the loadDepartments function when the page is fully loaded
document.addEventListener('DOMContentLoaded', loadDepartments);

