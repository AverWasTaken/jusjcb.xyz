window.addEventListener('load', function() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.transition = 'opacity 1.3s ease';
        preloader.style.opacity = 0;

        // Set a timeout to remove the preloader after the fade-out transition
        setTimeout(function() {
            preloader.style.display = 'none';
            preloader.remove(); // This line ensures the element is removed from the DOM
        }, 1300); // This delay should match the duration of the opacity transition
    }

    // Make all elements with the 'content-area' class visible
    var contentElements = document.querySelectorAll('.content-area');
    contentElements.forEach(function(element) {
        element.style.visibility = 'visible';
    });
});
