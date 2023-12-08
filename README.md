# Project Title
SmartRelief

## 1. Project Description
* Public washroom locator with review and amenity filtering system - Hason 
* Our application can provide a useful information for anyone who use public washroom. - Hyebin

## 2. Names of Contributors
* Hason Wong
* Hyebin Lee
* Louise Li
* Daniel Seo 
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* Google Maps Platform API

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Create account with email
* Find your current location on map
* Find nearest washroom marker
* Click marker and direct yourself via google maps

## 5. Known Bugs and Limitations
Here are some known bugs:
* Clicking on a bathroom marker will re-direct to google maps but only show lat/long for address
* Distance filter is not functional at the moment
* No moderation for newly added washrooms

## 6. Features for Future
What we'd like to build in the future:
* Either implement directions onto our app or redirecting to google maps automatically sets the route from your location
* Displaying washroom cards as a carousel or list rather than a grid
* Implementing a way for washrooms and reviews to require approval before releasing for public visibility
* Completing the filter function properly
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── img                      # Folder for images
    / AddLocation.png        # Banner image for add location page.
    / back.png               # Image of the back button.
    / logo.jpg               # Image of the logo.
    / logo-bgremoved.png     # Image of the logo with a removed background.
    / main-image             # Banner image for the login page.
├── scripts                  # Folder for scripts
    / account-information.js # Script for account-after-login.html
    / addlocation.js         # Script for addlocation.html
    / authentication.js      # Script for login.html
    / eachWashroom.js        # Script for eachWashroom.html
    / favorites.js           # Script for favorites.html
    / firebaseAPI.js         # Initialization code for SmartRelief using Firebase.
    / header.js              # Script for header.html
    / index.js               # Script for index.html
    / main.js                # Script for main.html
    / preference.js          # Script for preference.html
    / review.js              # Script for review.html
├── styles                   # Folder for styles
    / style.css              # Folder for CSS style


```


