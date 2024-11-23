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

    //iterate through array where name is city and return its capital
    //console.log(data);
    const inputCity = document
      .getElementById("inputCity")
      .value.toLowerCase();

    if (!inputCity) {
      throw new Error("Please enter a valid city name.");
    }

    const city = data.data.find(
      (c) => c.name.toLowerCase() === inputCity
    );

    if (city) {
      const returnedCapital = document.getElementById("returnedCapital");
      returnedCapital.textContent = `The capital of ${capitaliseEachWord(
        inputCity
      )} is ${city.capital}.`;
    } else {
      throw new Error("City not found.");
    }
  } catch (error) {
    console.error(error);
  }
} */
const cityInput = document.getElementById("cityDropDownInput");
cityInput.addEventListener("input", onInputChange)
let listOfCities = [];

citySearch()

async function citySearch() {
try {
    const cityURL = "https://countriesnow.space/api/v0.1/countries/population/cities";  //XCHANGE LINK
    const cityResponse = await fetch(cityURL);

    const cityData = await cityResponse.json();

    //note for self: .map is kinda like foreach
    listOfCities = cityData.data.map((city) => {
    return city.city;  //CHECK WHERE CITY IS
    });

} catch (error) {
    console.error(error);
}
}

    
function onInputChange() {
    removeCityDropDown(); //get rid of it and let the rest make a new one

    const value = cityInput.value.toLowerCase();

    if (value.length === 0) {
        return;
    }

    const filteredNames = [];

    listOfCities.forEach(cityRead => {
        if (cityRead.substr(0, value.length).toLowerCase() === value){
            filteredNames.push(cityRead);
        }
    });

    createCityDropDown(filteredNames);
}

function createCityDropDown(list) {
    const listElement = document.createElement("ul");
    listElement.className = "cityDropDown";
    listElement.id = "cityDropDown";

    list.forEach(city => {
        const listItem = document.createElement("li");

        const cityButton = document.createElement("button");
        cityButton.innerHTML = city; //city is alr a string
        cityButton.addEventListener("click", onCityButtonClick);
        listItem.appendChild(cityButton);

        listElement.appendChild(listItem);
    })

    document.getElementById("cityDropDownWrapper").appendChild(listElement);
}

function removeCityDropDown() {  //there's a bunch of copies when u delete a character; this fixes this
    const listElement = document.getElementById("cityDropDown");
    if (listElement) {
        listElement.remove(); //if there's a copy, remove it
    }
}

function onCityButtonClick(event) {
    event.preventDefault();     //avoids doing the default
    const buttonElement = event.target;   //always references the city clicked
    cityInput.value = buttonElement.innerHTML;

    console.log(buttonElement);

    removeCityDropDown();
}

function searchForUserInput() {
    const userEntered = document.getElementById("cityDropDownInput").value;
    const searchedCity  = document.getElementById("searchedCity");
    searchedCity.textContent = userEntered;

    //instantiate columns and stuff if city found
    const cityFlag  = document.getElementById("cityFlag");
    
    if (listOfCities.includes(userEntered)) {
        cityFlag.textContent = "City exists! Loading details..."
    }
    else {
        cityFlag.textContent = "ERROR: City doesn't exist. Try again."
    }
}

document.getElementById("cityForm").onsubmit = function(event) {
    event.preventDefault();
    searchForUserInput();
};s