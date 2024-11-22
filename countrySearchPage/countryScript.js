/* function capitaliseEachWord(str) {
  return str
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join the array back into a string with spaces
}

async function fetchCapital() {
  try {
    const capitalURL = "https://countriesnow.space/api/v0.1/countries/capital";
    const response = await fetch(capitalURL);

    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();

    //iterate through array where name is country and return its capital
    //console.log(data);
    const inputCountry = document
      .getElementById("inputCountry")
      .value.toLowerCase();

    if (!inputCountry) {
      throw new Error("Please enter a valid country name.");
    }

    const country = data.data.find(
      (c) => c.name.toLowerCase() === inputCountry
    );

    if (country) {
      const returnedCapital = document.getElementById("returnedCapital");
      returnedCapital.textContent = `The capital of ${capitaliseEachWord(
        inputCountry
      )} is ${country.capital}.`;
    } else {
      throw new Error("Country not found.");
    }
  } catch (error) {
    console.error(error);
  }
} */
const countryInput = document.getElementById("countryDropDownInput");
countryInput.addEventListener("input", onInputChange)
let listOfCountries = [];

countrySearch()

async function countrySearch() {
  try {
    const countryURL = "https://countriesnow.space/api/v0.1/countries";
    const countryResponse = await fetch(countryURL);

    const countryData = await countryResponse.json();

    //note for self: .map is kinda like foreach
    listOfCountries = countryData.data.map((country) => {
      return country.country;
    });

  } catch (error) {
    console.error(error);
  }
}

    
function onInputChange() {
    removeCountryDropDown(); //get rid of it and let the rest make a new one

    const value = countryInput.value.toLowerCase();

    if (value.length === 0) {
        return;
    }

    const filteredNames = [];

    listOfCountries.forEach(countryRead => {
        if (countryRead.substr(0, value.length).toLowerCase() === value){
            filteredNames.push(countryRead);
        }
    });

    createCountryDropDown(filteredNames);
}

function createCountryDropDown(list) {
    const listElement = document.createElement("ul");
    listElement.className = "countryDropDown";
    listElement.id = "countryDropDown";

    list.forEach(country => {
        const listItem = document.createElement("li");

        const countryButton = document.createElement("button");
        countryButton.innerHTML = country; //country is alr a string
        countryButton.addEventListener("click", onCountryButtonClick);
        listItem.appendChild(countryButton);

        listElement.appendChild(listItem);
    })

    document.getElementById("countryDropDownWrapper").appendChild(listElement);
}

function removeCountryDropDown() {  //there's a bunch of copies when u delete a character; this fixes this
    const listElement = document.getElementById("countryDropDown");
    if (listElement) {
        listElement.remove(); //if there's a copy, remove it
    }
}

function onCountryButtonClick(event) {
    event.preventDefault();     //avoids doing the default
    const buttonElement = event.target;   //always references the country clicked
    countryInput.value = buttonElement.innerHTML;

    console.log(buttonElement);

    removeCountryDropDown();
}

function searchForUserInput() {
    const userEntered = document.getElementById("countryDropDownInput").value;
    const searchedCountry  = document.getElementById("searchedCountry");
    searchedCountry.textContent = userEntered;

    //instantiate columns and stuff if country found
    const countryFlag  = document.getElementById("countryFlag");
    
    if (listOfCountries.includes(userEntered)) {
        countryFlag.textContent = "Country exists! Loading details..."
    }
    else {
        countryFlag.textContent = "ERROR: Country doesn't exist. Try again."
    }
}

document.getElementById("countryForm").onsubmit = function(event) {
    event.preventDefault();
    searchForUserInput();
};