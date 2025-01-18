import { fetchCountries } from "./fetch-countries";
import debounce from "lodash.debounce";
import { error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const searchInputEl = document.querySelector("#search-country");
const countriesListEl = document.querySelector(".countries-list");
const countryInfoEl = document.querySelector(".country-info");

const renderCountriesList = (countries) => {
  countriesListEl.innerHTML = countries
    .map((country) => {
      return `<li class="country-item">
                <p>${country.name.common}</p>
              </li>`;
    })
    .join("");

  countryInfoEl.innerHTML = "";
};

const renderCountryInfo = (country) => {
  const { name, capital, population, languages, flags } = country;

  const renderCapitalsList = () => {
    if (Object.values(capital).length > 1) {
      return `
          <ul class="capitals-list">
              ${Object.values(capital)
                .map((capital) => `<li>${capital}</li>`)
                .join("")}
          </ul>
        `;
    } else {
      return Object.values(capital)
        .map((capital) => `<p class="capital">${capital}</p>`)
        .join("");
    }
  };

  const renderLanguagesList = () => {
    if (Object.values(languages).length > 1) {
      return `
          <ul class="languages-list">
              ${Object.values(languages)
                .map((language) => `<li>${language}</li>`)
                .join("")}
          </ul>
        `;
    } else {
      return Object.values(languages)
        .map((language) => `<p class="language">${language}</p>`)
        .join("");
    }
  };

  countryInfoEl.innerHTML = `
    <div class="country-box">
      <h2 class="country-title">${name.common}</h2>
      <div class="country-couple">
          <ul class="country-list">
              <li class="country-capital"><span class="country-denomination">Capital:</span>${renderCapitalsList()}</li>
              <li class="country-population"><span class="country-denomination">Population:</span>${population}</li>
              <li class="country-languages"><span class="country-denomination">Languages:</span> ${renderLanguagesList()}</li>
          </ul>
          <img src="${flags.svg}" alt="Flag of ${name}" class="country-flag"/>
      </div>
    </div>
    `;

  const countryCapitalEl = document.querySelector(".country-capital");
  if (Object.values(capital).length === 1) {
    countryCapitalEl.classList.add("capital");
  }

  const countryLanguagesEl = document.querySelector(".country-languages");
  if (Object.values(languages).length === 1) {
    countryLanguagesEl.classList.add("language");
  }

  countriesListEl.innerHTML = "";
};

searchInputEl.addEventListener(
  "input",
  debounce((e) => {
    const query = e.target.value.trim();

    fetchCountries(query)
      .then((countries) => {
        if (countries.length > 10) {
          error({
            text: "Too many matches found. Please enter a more specific query!",
          });
          return;
        }

        if (countries.length === 1) {
          renderCountryInfo(countries[0]);
        } else {
          renderCountriesList(countries);
        }
      })
      .catch(() => {
        countriesListEl.innerHTML = "";
        countryInfoEl.innerHTML = "";

        error({
          text: "Країну не знайдено, спробуйте ще раз",
        });
      });
  }, 500)
);
