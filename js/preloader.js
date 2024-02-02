window.addEventListener('load', function() {
    // Hide the preloader
    document.getElementById('preloader').style.display = 'none';

    // Get all elements with the 'main-content' class
    var contentElements = document.querySelectorAll('.content-area');

    // Iterate over each element and set its visibility to visible
    contentElements.forEach(function(element) {
        element.style.visibility = 'visible';
    });
});