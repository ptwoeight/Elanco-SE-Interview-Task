const countryInput = document.getElementById("countryDropDownInput");
countryInput.addEventListener("input", onInputChange)
let listOfCountries = [];
let filteredNames = []; 
let chartInstance = null;
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

    filteredNames = [];

    listOfCountries.forEach(countryRead => {
        if (countryRead.substr(0, value.length).toLowerCase() === value){
            filteredNames.push(countryRead);
        }
    });

    createCountryDropDown(filteredNames);
}

countryInput.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    //if there are matching countries in the dropdown, click the top one
    if (filteredNames.length > 0) {
      const firstCountryButton = document.querySelector('.countryDropDown button');
      firstCountryButton.click();
    }
  }
});

document.querySelector('.btnSubmit').addEventListener('click', function(event) {
  event.preventDefault();

  if (filteredNames.length > 0) {
    const firstCountryButton = document.querySelector('.countryDropDown button');
    firstCountryButton.click();
  }
  else {
    displayInvalidCountryMessage();
  }
});



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
    removeCountryDropDown();
    searchForUserInput();
}

async function searchForUserInput() {
  //search bar confirm country
  const userEntered = document.getElementById("countryDropDownInput").value;
  const searchedCountry  = document.getElementById("searchedCountry");
  searchedCountry.innerHTML = userEntered;

  document.getElementById("separator").style.display = 'none';
  document.getElementById("canvas").style.display = 'none';

  if (listOfCountries.some(country => country.toLowerCase() === userEntered.toLowerCase())) {
    document.getElementById("separator").style.display = 'block';
    document.getElementById("canvas").style.display = 'block';
  
    //flag
    displayFlag(userEntered);

    //iso and capital info
    displayCountryDetails(userEntered);

    //citycount info
    displayCountryCityCount(userEntered);
    
    //populationChart
    populationChart(userEntered);
  } 
  else {
    displayInvalidCountryMessage();
  }
}



async function displayFlag(countryName) {
  const flagURL = "https://countriesnow.space/api/v0.1/countries/flag/images";
  const flagResponse = await fetch(flagURL);
  const flagData = await flagResponse.json();

  const matchingFlag = flagData.data.find(country => country.name === countryName);
  const flagImage = document.getElementById("countryFlag");

  console.log(matchingFlag);

  if(matchingFlag) {
    flagImage.src = matchingFlag.flag;
  }
  else{
    flagImage.src = '';
    flagImage.alt = "[ Image of Country Flag ]";
  }
}

async function displayCountryDetails(countryName) {
  const countryURL = "https://countriesnow.space/api/v0.1/countries/capital";
  const countryResponse = await fetch(countryURL);
  const countryData = await countryResponse.json();
  const countryInfo = countryData.data.find(country => country.name === countryName);
  if(countryInfo) {
    document.getElementById("displayISO2").innerHTML = `ISO2: ${countryInfo.iso2}`;
    document.getElementById("displayISO3").innerHTML = `ISO3: ${countryInfo.iso3}`;
    document.getElementById("displayCapital").innerHTML = `Capital City: ${countryInfo.capital}`;
  }
  else {
    document.getElementById("displayISO2").innerHTML = "ISO2: Not found.";
    document.getElementById("displayISO3").innerHTML = "ISO3: Not found.";
    document.getElementById("displayCapital").innerHTML = "Capital City: Not found.";
  }
}

async function displayCountryCityCount(countryName) {
  const countryCitiesURL = "https://countriesnow.space/api/v0.1/countries";
  const citiesResponse = await fetch(countryCitiesURL);
  const citiesData = await citiesResponse.json();
  const countryWithCities = citiesData.data.find(country => country.country === countryName);
  if (countryWithCities) {
    const cityCount = countryWithCities.cities.length;
    document.getElementById("displayCityCount").innerHTML = `Number of cities: ${cityCount}`;
  }
  else {
    document.getElementById("displayCityCount").innerHTML = "Number of cities: Not found.";
  }
}



async function populationChart(countryName) {
  const response = await fetch("https://countriesnow.space/api/v0.1/countries/population");
  const data = await response.json();

  const countryData = data.data.find(country => country.country.includes(countryName));
  const chartTitle = document.getElementById("chartTitle");

  if (countryData) {
    const popData = countryData.populationCounts.map(item => ({
      year: item.year,
      value: item.value
    }));

    chartTitle.innerHTML = `Population Count of ${countryName}`;

    // Destroy the old chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Ensure canvas is visible
    document.getElementById("canvas").style.display = 'block';
    
    // Create a new chart
    chartInstance = createChart(popData, countryName);
  } else {
    document.getElementById("canvas").style.display = 'none';
    chartTitle.innerHTML = "Error: Failed to retrieve chart data.";
    chartInstance = null;
  }
}

function createChart(data) {
  const ctx = document.getElementById('canvas').getContext('2d');

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(row => row.year),
      datasets: [{
        label: `Population count`,
        data: data.map(row => row.value),
        borderWidth: 1 
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio: false
    }
  });
}



function displayInvalidCountryMessage() {
  searchedCountry.innerHTML = "ERROR: Invalid country. Try again.";
  document.getElementById("countryFlag").src = "";
  document.getElementById("countryFlag").alt = "";
  document.getElementById("displayISO2").innerHTML = "";
  document.getElementById("displayISO3").innerHTML = "";
  document.getElementById("displayCapital").innerHTML = "";
  document.getElementById("displayCityCount").innerHTML = "";
  document.getElementById("chartTitle").innerHTML = "";
  document.getElementById("canvas").innerHTML = "";
}

document.getElementById("countryForm").onsubmit = function(event) {
    event.preventDefault();
    searchForUserInput();
};

