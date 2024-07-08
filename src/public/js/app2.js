const container = document.querySelector(".container")

// Init 
document.addEventListener('DOMContentLoaded', init, false);
function init() {
  console.log('empty for now')
}

// serviceWorker
if ("serviceWorker" in navigator){
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
   
}

// Configure form currency source and destination

const currencySrc = [
    "BRL",
];
const currencyDst = [
    "USDBRL",
    "EURBRL",
];

function showCurrencySrc() {

    let currencySrcSelector = document.querySelector("#currencySrc");

    if(currencySrc.length){
        currencySrcSelector.hidden = false;
    }

    currencySrc.forEach((currency) => {
        let opt = document.createElement("option");
        opt.value = currency;
        opt.innerHTML = currency
        currencySrcSelector.appendChild(opt);
    });
}
document.addEventListener("DOMContentLoaded", showCurrencySrc())

function showCurrencyDst() {

    let currencyDstSelector = document.querySelector("#currencyDst");

    if(currencyDst.length){
        currencyDstSelector.hidden = false;
    }

    currencyDst.forEach((currency) => {
        let opt = document.createElement("option");
        opt.value = currency;
        opt.innerHTML = currency
        currencyDstSelector.appendChild(opt);
    });
}
document.addEventListener("DOMContentLoaded", showCurrencyDst())

// Manage Content list 

// get params from forms 
// calculate qtd * currency 
// salve on array
// list array
// edit array
// delete from array


// Calculate totals
// sum total array currency src
// sum total array currency dst