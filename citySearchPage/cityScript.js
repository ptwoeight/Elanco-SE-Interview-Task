const cityInput = document.getElementById("cityDropDownInput");
cityInput.addEventListener("input", onInputChange)
let listOfCountries = [];
let filteredNames = []; 
let chartInstance = null;
citySearch()



async function citySearch() {
  try {
    const cityURL = "https://countriesnow.space/api/v0.1/countries/population/cities";
    const cityResponse = await fetch(cityURL);

    const cityData = await cityResponse.json();

    //note for self: .map is kinda like foreach
    listOfCountries = cityData.data.map((city) => {
      return city.city;
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

    filteredNames = [];

    listOfCountries.forEach(cityRead => {
        if (cityRead.substr(0, value.length).toLowerCase() === value){
            filteredNames.push(cityRead);
        }
    });

    createCityDropDown(filteredNames);
}

cityInput.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    //if there are matching countries in the dropdown, click the top one
    if (filteredNames.length > 0) {
      const firstCityButton = document.querySelector('.cityDropDown button');
      firstCityButton.click();
    }
  }
});

document.querySelector('.btnSubmit').addEventListener('click', function(event) {
  event.preventDefault();

  if (filteredNames.length > 0) {
    const firstCityButton = document.querySelector('.cityDropDown button');
    firstCityButton.click();
  }
  else {
    displayInvalidCityMessage();
  }
});



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
    removeCityDropDown();
    searchForUserInput();
}

async function searchForUserInput() {
  //search bar confirm city
  const userEntered = document.getElementById("cityDropDownInput").value;
  const searchedCity  = document.getElementById("searchedCity");
  searchedCity.innerHTML = userEntered;

  document.getElementById("separator").style.display = 'none';
  document.getElementById("canvas").style.display = 'none';

  if (listOfCountries.some(city => city.toLowerCase() === userEntered.toLowerCase())) {
    document.getElementById("separator").style.display = 'block';
    document.getElementById("canvas").style.display = 'block';
  
    //flag
    displayFlag(userEntered);

    //iso and capital info
    displayCityDetails(userEntered);
    
    //populationChart
    populationChart(userEntered);
  } 
  else {
    displayInvalidCityMessage();
  }
}



async function displayFlag(cityName) {
  const flagURL = "https://countriesnow.space/api/v0.1/countries/flag/images";
  const flagResponse = await fetch(flagURL);
  const flagData = await flagResponse.json();

  // fetch city details, match country with userEntered(cityName)
  const cityURL = "https://countriesnow.space/api/v0.1/countries/population/cities";
  const cityResponse = await fetch(cityURL);
  const cityData = await cityResponse.json();
  const cityInfo = cityData.data.find(city => city.city === cityName);
  const cityCountry = cityInfo.country;

  const matchingFlag = flagData.data.find(country => country.name === cityCountry);
  const flagImage = document.getElementById("cityFlag");

  if(matchingFlag) {
    flagImage.src = matchingFlag.flag;
  }
  else{
    flagImage.src = '';
    flagImage.alt = "[ Image of City Flag ]";
  }
}

async function displayCityDetails(cityName) {
  const cityURL = "https://countriesnow.space/api/v0.1/countries/population/cities";
  const cityResponse = await fetch(cityURL);
  const cityData = await cityResponse.json();
  const cityInfo = cityData.data.find(city => city.city === cityName);
  let isCapital = false;

  //check if city is a capital
  isCapital = cityInfo.city === cityInfo.city.toUpperCase();
  if(cityInfo) {
    document.getElementById("displayCountry").innerHTML = `Country: ${cityInfo.country}`;
    document.getElementById("displayIsCapital").innerHTML = `Is Capital: ${isCapital}`;
  }
  else {
    document.getElementById("displayCountry").innerHTML = "Country: Not found.";
    document.getElementById("displayIsCapital").innerHTML = "Is Capital: Unable to read.";
  }
}



async function populationChart(cityName) {
  const response = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities");
  const data = await response.json();

  const cityData = data.data.find(city => city.city === cityName);
  const chartTitle = document.getElementById("chartTitle");

  if (cityData) {
    const popData = cityData.populationCounts.map(item => ({
      year: item.year,
      value: item.value
    }));

    chartTitle.innerHTML = `Population Count of ${cityName}`;

    if (chartInstance) {
      chartInstance.destroy();
    }

    document.getElementById("canvas").style.display = 'block';

    chartInstance = createChart(popData, cityName);
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
        borderWidth: 2 
      }]
    },
    options: {
      scales: {
        x: {
          offset: true
        },
        y: {
          beginAtZero: true,
          offset: true
        }
      },
      maintainAspectRatio: false
    }
  });
}



function displayInvalidCityMessage() {
  searchedCity.innerHTML = "ERROR: Invalid city. Try again.";
  document.getElementById("cityFlag").src = "";
  document.getElementById("cityFlag").alt = "";
  document.getElementById("displayCountry").innerHTML = "";
  document.getElementById("displayIsCapital").innerHTML = "";
  document.getElementById("chartTitle").innerHTML = "";
  document.getElementById("canvas").style.display = 'none';
  document.getElementById("separator").style.display = 'none';
  
  if (chartInstance) {
    chartInstance.destroy(); 
  }
}

document.getElementById("cityForm").onsubmit = function(event) {
    event.preventDefault();
    searchForUserInput();
};

