document.addEventListener("DOMContentLoaded", function() {
    // Fetch the content of the header.html file
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            // Insert the header content into the designated element
            document.getElementById("header-container").innerHTML = data;
        })
        .catch(error => console.error("Error fetching header content:", error));
});
