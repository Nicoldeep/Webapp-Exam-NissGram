// Function to preview the uploaded image
function previewImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];

    if (file) {
        console.log("JavaScript function running");

        const reader = new FileReader();
        reader.onload = function (e) {
            // Set the image as the content and remove any placeholder text
            imagePreview.innerHTML = '<img src="' + e.target.result + '" alt="Image Preview" class="img-fluid rounded">';

            // Remove border and background color for clean display
            imagePreview.classList.remove('border');
            imagePreview.style.border = 'none';

            // Add a class to control styling when an image is loaded
            imagePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    } else {
        // Reset to placeholder text and default styling if no image is loaded
        imagePreview.innerHTML = '<span class="text-muted">Image preview will appear here</span>';

        // Restore border and background color
        imagePreview.style.border = '1px solid #ddd';
        imagePreview.style.backgroundColor = '#f8f9fa';

        // Remove the class for image-loaded styling
        imagePreview.classList.remove('has-image');
    }
}

// Function to validate form submission
function validateForm(event) {
    const textArea = document.getElementById('textArea').value.trim();
    const uploadImage = document.getElementById('uploadImage').files.length > 0;

    if (!textArea && !uploadImage) {
        event.preventDefault(); // Prevent form submission
        const validationMessage = document.getElementById('combinedValidation');
        validationMessage.style.display = 'block';
        validationMessage.textContent = 'You must provide either text or an image.';
    } else {
        const validationMessage = document.getElementById('combinedValidation');
        validationMessage.style.display = 'none';
    }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Attach the previewImage function to the file input
    const uploadImageInput = document.getElementById('uploadImage');
    if (uploadImageInput) {
        uploadImageInput.addEventListener('change', previewImage);
    }

    // Attach the validateForm function to the form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', validateForm);
    }
});