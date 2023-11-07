document.addEventListener("DOMContentLoaded", function () {
    var searchButton = document.getElementById("search");
    if (searchButton) {
        searchButton.onclick = function () {
            location.href = "result.html";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var storageBin = document.getElementById("storagebin-checkbox");
    if (storageBin) {
        storageBin.onclick = function () {
            console.log("User selected storage bin option.");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var wheelchair = document.getElementById("wheelchair-checkbox");
    if (wheelchair) {
        wheelchair.onclick = function () {
            console.log("User selected wheelchair option.");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var waterfountain = document.getElementById("waterfountain-checkbox");
    if (waterfountain) {
        waterfountain.onclick = function () {
            console.log("User selected water fountain option.");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var airpump = document.getElementById("airpump-checkbox");
    if (airpump) {
        airpump.onclick = function () {
            console.log("User selected airpump option.");
        }
    }
});

// document.addEventListener("DOMContentLoaded", function(){
//     var backButton = document.getElementById("back");
//     if(back){
//         back.onclick = function(){
//             console.log("User clicked back button.");
//         }   
//     }    
// });




