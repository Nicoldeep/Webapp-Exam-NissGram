/* Preview uploaded profile picture
function previewProfileImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const preview = document.getElementById('profileImagePreview');

    if (file) {
        reader.onload = function (e) {
            // Display the preview image
            preview.innerHTML = `<img src="${e.target.result}" alt="Profile Picture Preview" 
                                  style="max-width: 150px; max-height: 150px; object-fit: contain;" />`;
        };
        reader.readAsDataURL(file);
    } else {
        // Display placeholder text if no image is uploaded
        preview.innerHTML = '<span class="text-muted">No image uploaded</span>';
    }
}

// Attach the upload trigger to the custom button
document.getElementById('uploadProfilePictureButton').addEventListener('click', function () {
    document.getElementById('uploadProfilePicture').click();
});

// Attach change event to the file input
document.getElementById('uploadProfilePicture').addEventListener('change', previewProfileImage);*/

// Preview uploaded profile picture
function previewProfileImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const preview = document.getElementById('profileImagePreview');
    const deleteButton = document.getElementById('deleteProfilePictureButton');

    if (file) {
        reader.onload = function (e) {
            // Display the preview image
            preview.innerHTML = `<img src="${e.target.result}" alt="Profile Picture Preview" 
                                  style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`;

            // Enable the delete button
            deleteButton.disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

// Attach the upload trigger to the "+" button
document.getElementById('uploadProfilePictureButton').addEventListener('click', function () {
    document.getElementById('uploadProfilePicture').click();
});

// Attach change event to the file input
document.getElementById('uploadProfilePicture').addEventListener('change', previewProfileImage);

{// Handle delete button functionality
document.getElementById('deleteProfilePictureButton').addEventListener('click', function () {
    const preview = document.getElementById('profileImagePreview');
    const deleteButton = document.getElementById('deleteProfilePictureButton');
    const fileInput = document.getElementById('uploadProfilePicture');

    // Set the preview to the default picture
    preview.innerHTML = '<img src="/images/profile_image_default.png" alt="Default Profile Picture" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />';

    // Disable the delete button
    deleteButton.disabled = true;

    // Clear the file input
    fileInput.value = '';

    // Set a hidden field or form value to indicate the default picture is being used
    document.getElementById('deleteProfilePicture').value = 'true';
});}


