var urlName;
var totalNumbers = 0;
var pageNumber = 0;
var numberOfPagesToDisplay = 1;
var searchPython = false;
var searchJSON = false;
var searchJavaScript = false;
var searchSQL = false;

function handleSelection(selection) {
    numberOfPagesToDisplay = selection.options[selection.selectedIndex].value;
};

function handleClick1(cb) {
    if (cb.checked == true) {
        searchPython = true;
    } else {
        searchPython = false;
    }
};

function handleClick2(cb) {
    if (cb.checked == true) {
        searchJSON = true;
    } else {
        searchJSON = false;
    }
};

function handleClick3(cb) {
    if (cb.checked == true) {
        searchJavaScript = true;
    } else {
        searchJavaScript = false;
    }
};

function handleClick4(cb) {
    if (cb.checked == true) {
        searchSQL = true;
    } else {
        searchSQL = false;
    }
};

function searchButtonResults() {

    // clean out the list for a new search

    var node = document.getElementById("resultsDiv");
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }

    // reset totalNumbers and pageNumber to 0

    totalNumbers = 0;
    pageNumber = 0;

    // get numberOfPagesToDisplay to display pages worth of data

    for (var a = 0; a < numberOfPagesToDisplay; a++) {

        // get 30 items per page

        urlName = "https://api.github.com/gists?page=" + a + "&per_page=30";

        getGistSearchResults(); 
    }
};

function getGistSearchResults() {
    var xmlhttp;

    // try to create the request

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // make the GET command

    xmlhttp.open("GET", urlName);
    xmlhttp.send();

    // when ready, read in the result

    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            pageNumber = pageNumber + 1;

            document.getElementById("resultsDiv").innerHTML += "<p>" + "Page: " + pageNumber + "</p>";

            // parse the xmlhttp.responseTest into the results object

            var results = JSON.parse(xmlhttp.responseText);

            totalNumbers = totalNumbers + results.length;

            document.getElementById("resultsDiv").innerHTML += "<p>" + "Number of files: " + totalNumbers + "</p>";

            // walk thru the results and format the text for display

            for (var i = 0; i < results.length; i++) {

                // grab any files objects in each results object

                var files = results[i].files;

                // now format the links to be printed out in resultsDiv back in the a3p2.html document

                for (var j in files) {
                    if (searchPython == true && files[j].language == "Python") {
                        formatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
                    }

                    if (searchJSON == true && files[j].language == "JSON") {
                        formatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
                    }

                    if (searchJavaScript == true && files[j].language == "JavaScript") {
                        formatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
                    }

                    if (searchSQL == true && files[j].language == "SQL") {
                        formatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
                    }

                    if (searchPython == false && searchJSON == false && searchJavaScript == false && searchSQL == false) {
                        // search for all file types

                        formatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
                    }
                }

            }
        }

    }

};

function formatResults(html_url, description, filename, language) {
    var formattedString = "<p><input type='checkbox'/> Add/Remove to Favorites " +
                          "<a href = '" +
                          html_url +
                          "'>"
                          + "Link: " + html_url +
                          "     Description: " + description +
                          "     Filename: " + filename +
                          "     Language: " + language +
                          "</a></p>";

    // now make sure that this formatted string is not already in the favorites list
    // walk thru the favorites list and compare the two strings
    // only put in the formatted string to the search list if it isn't in the favorites list

    var isAlreadyInFavorites = false;
    var doc = document.getElementById("favoritesDiv");

    for (var x = 0; x < doc.childNodes.length; x++) {
        var testString = new XMLSerializer().serializeToString(doc.childNodes[x]);

        // test the html_url since it is a unique string

        if (testString.includes(hmtl_url)==true) {
            isAlreadyInFavorites = true;

            // break out of for loop if this is the case, no need to search the rest of the list

            break;
        }
    }

    if (isAlreadyInFavorites == false) {
        document.getElementById("resultsDiv").innerHTML += formattedString;
    }
};

function addToFavorites() {
    var doc = document.getElementById("resultsDiv");
    var numberOfElements = doc.childNodes.length;
    var isChecked;
    var output;
    var outputString;

    // add to favorites list

    for (var x = 0; x < numberOfElements; x++) {
        isChecked = doc.childNodes[x].childNodes[0].checked;

        if (isChecked == true) {
            // get the child that is checked from resultsDiv!!!!

            output = doc.childNodes[x];

            // covert the child object to a string

            var outputString = new XMLSerializer().serializeToString(output);

            // add to my favorites, i.e. favoritesDiv and localStorage if possible

            if (typeof (Storage) !== "undefined") {
                var tempFavorites = localStorage.getItem("favorites");

               if (tempFavorites == null) {
                    tempFavorites = outputString;
                } else {
                    var tempStringHolder = tempFavorites;
                    tempFavorites = tempStringHolder + outputString;
               }

                localStorage.setItem("favorites", tempFavorites);

                document.getElementById("favoritesDiv").innerHTML = localStorage.getItem("favorites");
            } else {
                document.getElementById("favoritesDiv").innerHTML += outputString;
            }
        }
    }

    // remove the elements that were added to favorites

    removeFromResults();
};

function removeFromResults() {
    var doc = document.getElementById("resultsDiv");
    var isChecked;
    var setExit = false;

    while (doc.hasChildNodes() && setExit == false) {
        for (var x = 0; x < doc.childNodes.length; x++) {

            isChecked = doc.childNodes[x].childNodes[0].checked;

            if (isChecked == true) {
                // remove the child

                doc.removeChild(doc.childNodes[x]);

                // set the setExit condition to false since we removed a single child

                setExit = false;

                // break out the for loop and go back to the while loop
                // since childRemove resets the length of the number of childNodes

                break;
            } else {
                // if you get thru the entire list, then there were no childs to be delete
                // setExit to true and at the while loop you will exit

                setExit = true;
            }
        }
    }
};

function removeFromFavorites() {
    var doc = document.getElementById("favoritesDiv");
    var isChecked;
    var setExit = false;

    while (doc.hasChildNodes() && setExit == false) {
        for (var x = 0; x < doc.childNodes.length; x++) {

            isChecked = doc.childNodes[x].childNodes[0].checked;

            if (isChecked == true) {
                // remove the child

                doc.removeChild(doc.childNodes[x]);

                // set the setExit condition to false since we removed a single child

                setExit = false;

                // break out the for loop and go back to the while loop
                // since childRemove resets the length of the number of childNodes

                break;
            } else {
                // if you get thru the entire list, then there were no childs to be delete
                // setExit to true and at the while loop you will exit

                setExit = true;
            }
        }
    }

    // now remove from localStorage copy if available

    localStorage.clear();

    // need to initialize the tempFavString to something otherwise it will add junk to the localStorage
    // will cut it out of the final tempFavString to get the proper output string

    var tempFavString = "DUMMYSTRINGTOREMOVE";

    for (var y = 0; y < doc.childNodes.length; y++) {
        var output = new XMLSerializer().serializeToString(doc.childNodes[y]);

        tempFavString = tempFavString + output;

        // now delete the DUMMYSTRINGTOREMOVE to get a clean listing of favorites
        tempFavString = tempFavoriteString.replace("DUMMYSTRINGTOREMOVE", "");

    }
 
    localStorage.setItem("favorites", tempFavString);

};

function fillFavorites() {
    if (typeof (Storage) !== "undefined") {
  
        var storedString = localStorage.getItem("favorites");

        document.getElementById("favoritesDiv").innerHTML = storedString;
    }
};

function removeAllFromFavorites() {

    // clean out the list for a new search

    var node = document.getElementById("favoritesDiv");
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }

    // now remove from localStorage if available

    if (typeof (Storage) !== "undefined") {
        localStorage.clear();
    }
};