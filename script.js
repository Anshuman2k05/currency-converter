// API URL and Key
const apiKey = '30d78253f60d922f4b16eab0'; // Your actual API key
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

let currencies = [];
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const exchangeRateInfo = document.getElementById('exchangeRateInfo');

// Fetch currency data from the API
async function fetchCurrencyData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.result === "success") {
            currencies = Object.keys(data.conversion_rates);
            populateCurrencyOptions();
        } else {
            showError("Failed to load currencies.");
        }
    } catch (error) {
        showError("Error fetching data. Please try again.");
    }
}

// Populate currency dropdown options dynamically
function populateCurrencyOptions() {
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.innerText = currency;
        fromCurrency.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.innerText = currency;
        toCurrency.appendChild(option2);
    });
}

// Convert currency based on selected values
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerText = "Please enter a valid amount.";
        return;
    }

    loadingDiv.style.display = "block";
    resultDiv.style.display = "none";
    exchangeRateInfo.style.display = "none";

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const conversionRateFrom = data.conversion_rates[from];
        const conversionRateTo = data.conversion_rates[to];

        if (conversionRateFrom && conversionRateTo) {
            const convertedAmount = (amount / conversionRateFrom) * conversionRateTo;
            const exchangeRate = conversionRateTo / conversionRateFrom;

            resultDiv.innerText = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
            exchangeRateInfo.innerText = `Exchange rate: 1 ${from} = ${exchangeRate.toFixed(4)} ${to}`;

            loadingDiv.style.display = "none";
            resultDiv.style.display = "block";
            exchangeRateInfo.style.display = "block";
        } else {
            showError("Invalid currency selected.");
        }
    } catch (error) {
        showError("Error during conversion.");
    }
}

// Show error message
function showError(message) {
    loadingDiv.style.display = "none";
    resultDiv.style.display = "none";
    exchangeRateInfo.style.display = "none";
    resultDiv.innerText = message;
}

// Initialize the currency data and populate dropdowns
fetchCurrencyData();
