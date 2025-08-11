let quoteDisplay = document.getElementById("quote");
let quoteInput = document.getElementById("quoteInput");
let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let submitBtn = document.getElementById("submitBtn");
let resultEl = document.getElementById("result");
let timeSelect = document.getElementById("timeSelect");

let timeLimit = 60;
let timeLeft = 60;
let timerId = null;
let quote = "";
let apiQuotes = [];

// Fetch quotes from API
async function loadQuotes() {
    try {
        let res = await fetch("https://dummyjson.com/quotes");
        let data = await res.json();
        apiQuotes = data.quotes;
    } catch (error) {
        quoteDisplay.textContent = "Failed to load quotes!";
    }
}

// Pick a random quote
function showNewQuote() {
    if (apiQuotes.length > 0) {
        let randomIndex = Math.floor(Math.random() * apiQuotes.length);
        quote = apiQuotes[randomIndex].quote;
        quoteDisplay.textContent = quote;
    }
}

// Live typing border feedback
quoteInput.addEventListener("input", () => {
    let typed = quoteInput.value;
    if (quote.startsWith(typed)) {
        quoteInput.classList.add("correct-border");
        quoteInput.classList.remove("wrong-border");
    } else {
        quoteInput.classList.add("wrong-border");
        quoteInput.classList.remove("correct-border");
    }
});

// Start the test
startBtn.onclick = function () {
    timeLimit = parseInt(timeSelect.value);
    timeLeft = timeLimit;
    timerDisplay.textContent = timeLeft;
    quoteInput.value = "";
    resultEl.textContent = "";
    quoteInput.disabled = false;
    submitBtn.disabled = false;
    quoteInput.focus();
    showNewQuote();
    clearInterval(timerId);
    timerId = setInterval(updateTimer, 1000);
};

// Timer countdown
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerId);
        checkResult();
    }
}

// Submit button
submitBtn.onclick = function () {
    clearInterval(timerId);
    checkResult();
};

// Check result
function checkResult() {
    quoteInput.disabled = true;
    submitBtn.disabled = true;
    let typedValue = quoteInput.value.trim();
    let timeTaken = timeLimit - timeLeft;

    if (typedValue === quote) {
        let wpm = Math.round((typedValue.split(" ").length / timeTaken) * 60);
        resultEl.textContent = `You completed in ${timeTaken} seconds! WPM: ${wpm}`;
    } else if (timeLeft <= 0) {
        resultEl.textContent = "Time's up! Try again.";
    } else {
        resultEl.textContent = "Quote not typed exactly.";
    }
}

// Load quotes on page load
loadQuotes();