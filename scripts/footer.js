document.addEventListener("DOMContentLoaded", function() {
    // Fetch the content of the footer.html file
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            // Insert the footer content into the designated element
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => console.error("Error fetching footer content:", error));
});
