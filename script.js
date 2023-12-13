//Variabler för alla elemet från html
const form = document.querySelector("form");
const formTextInput = document.querySelector("#textInput");
const radioOptionCountryName = document.querySelector("nameRadio");
const radioOptionLanguage = document.querySelector("languageRadio");
const infoDivContainer = document.querySelector("#infoContainer");

//Variabler för att skapa element
const h1ErrorMessage = document.createElement("h1");

//En eventlistener på submit knappen i formuläret
form.addEventListener("submit", (event) => {
  event.preventDefault();

  infoDivContainer.innerHTML = "";
  h1ErrorMessage.innerHTML = "";

  const textInputValue = formTextInput.value;
  console.log(textInputValue);
  const radioValues = document.querySelector(":checked").value;
  console.log(radioValues);
  const url = `https://restcountries.com/v3.1/${radioValues}/${textInputValue}?fields=name,capital,subregion,population,flags`;

  //Fetchar min url från API:et till ett js-objekt
  fetch(url)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(displayCountries)
    .catch(displayError);
  form.reset();
});

//Funktion som gör en array baserat utifrån befolkningsmängd
function displayCountries(countries) {
  const sortedPopulationArr = _.sortBy(countries, "population");

  //en for-loop som loopar igenom den sorterade arrayn och som sedan visas i DOM:en
  for (const country of sortedPopulationArr) {
    displayInfoAboutCountry(country);
  }
}

// Function för vilka element som ska skapas vid en sökning på varje land
function displayInfoAboutCountry(country) {
  const countryOfficialNameEl = document.createElement("h2");
  const subRegionEl = document.createElement("p");
  const capitalEl = document.createElement("p");
  const populationEl = document.createElement("p");

  const flagImageEl = document.createElement("img");
  const container = document.createElement("div");

  container.append(
    countryOfficialNameEl,
    subRegionEl,
    capitalEl,
    populationEl,
    flagImageEl
  );

  infoDivContainer.prepend(container);

  countryOfficialNameEl.innerText = country.name.official;
  subRegionEl.innerText = "Subregion: " + country.subregion;
  capitalEl.innerText = "Capital: " + country.capital[0];
  populationEl.innerText = "Population: " + country.population;
  flagImageEl.src = country.flags.png;
}

//Funktion för vad som ska hända vid ett error
function displayError(error) {
  console.log(error);
  document.body.append(h1ErrorMessage);
  if (error.status === 404) {
    h1ErrorMessage.innerText =
      error.status +
      " " +
      error.statusText +
      ". " +
      "Country or language were not found, try again and check the boxes.";
  } else {
    h1ErrorMessage.innerText = "Something went wrong... Try again later.";
  }
}
