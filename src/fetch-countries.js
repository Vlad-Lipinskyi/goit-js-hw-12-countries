const url = "https://restcountries.com/v3.1/name";

export const fetchCountries = (searchQuery) => {
    return fetch(`${url}/${searchQuery}?fields=name,capital,population,languages,flags`).then((response) => response.json()).then((data) => data);
};