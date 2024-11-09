document.addEventListener('DOMContentLoaded', function() {
    // Initialize the modal
    const addCategoryModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    
    // Handle category form submission
    document.getElementById('saveCategory').addEventListener('click', function() {
        const categoryName = document.getElementById('category_name').value.trim();
        
        if (!categoryName) {
            alert('Please enter a category name');
            return;
        }

        fetch('/category/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_name: categoryName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Category added successfully');
                // Close the modal
                addCategoryModal.hide();
                // Clear the form
                document.getElementById('category_name').value = '';
                // Refresh the page to update the sidebar
                window.location.reload();
            } else {
                alert('Error adding category: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding category: ' + error.message);
        });
    });
});