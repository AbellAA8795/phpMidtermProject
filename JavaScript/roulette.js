let selectedBettingOption = null;
const wheel = document.getElementById('wheel');
const resultDiv = document.getElementById('result');
let isSpinning = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeWheel();
    setupBettingButtons();
    setupFormSubmission();
});

function initializeWheel() {
    // Clear wheel first
    wheel.innerHTML = '';

    for (let i = 1; i <= 30; i++) {
        const angle = (i - 1) * 12; // 12 degrees per number
        const number = document.createElement('div');
        number.textContent = i;
        number.style.position = 'absolute';
        number.style.width = '100%';
        number.style.height = '100%';
        number.style.display = 'flex';
        number.style.alignItems = 'center';
        number.style.justifyContent = 'center';
        number.style.fontSize = '18px';
        number.style.fontWeight = 'bold';
        number.style.color = 'white';
        number.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
        number.style.transform = `rotate(${angle}deg) translateY(-170px)`;

        wheel.appendChild(number);
    }
}

function setupBettingButtons() {
    const bettingButtons = document.querySelectorAll('.game-buttons button');

    bettingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            if (isSpinning) return;

            // Remove active class from all buttons
            bettingButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Store the selected option
            selectedBettingOption = this.textContent.trim();
            console.log('Selected: ' + selectedBettingOption);
        });
    });
}

function setupFormSubmission() {
    const form = document.querySelector('.betting-input form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        confirmBet();
    });
}

function confirmBet() {
    const betAmountInput = document.querySelector('.betting-input input[type="text"]');
    const betAmount = betAmountInput.value.trim();

    // Validation: Check if bet amount is entered
    if (!betAmount || isNaN(betAmount) || parseFloat(betAmount) <= 0) {
        alert('Please enter a valid bet amount!');
        return;
    }

    // Validation: Check if betting option is selected
    if (!selectedBettingOption) {
        alert('Please select a betting option!');
        return;
    }

    // Confirmation dialog
    const confirmed = confirm(`Confirm Your Bet?\n\nBetting Option: ${selectedBettingOption}\nBet Amount: ₱${parseFloat(betAmount).toFixed(2)}`);

    if (confirmed) {
        spinRoulette(betAmount);
    }
}

function spinRoulette(betAmount) {
    isSpinning = true;
    resultDiv.innerHTML = '';
    const submitButton = document.querySelector('.betting-input input[type="submit"]');
    submitButton.disabled = true;
    submitButton.value = 'Spinning...';

    // Generate random spin rotation (5 full rotations + random angle)
    const randomSpin = Math.floor(Math.random() * 360);
    const totalRotation = 5 * 360 + randomSpin;

    wheel.classList.add('spinning');

    setTimeout(() => {
        wheel.classList.remove('spinning');
        wheel.style.transform = `rotate(${totalRotation}deg)`;

        // Calculate which number the wheel landed on
        const landedNumber = calculateLandedNumber(totalRotation);

        // Send to PHP with the actual landed number
        sendBetToPhp(landedNumber, betAmount);

        isSpinning = false;
        submitButton.disabled = false;
        submitButton.value = 'Submit';
    }, 3000);
}

function calculateLandedNumber(rotation) {
    // Normalize rotation to 0-360 range
    const normalizedRotation = rotation % 360;

    // Each number takes up 12 degrees (360 / 30)
    // Number 1 is at 0 degrees, Number 2 at 12 degrees, etc.
    const numberSlot = Math.floor(normalizedRotation / 12);

    // Convert slot to number (1-30)
    const landedNumber = ((numberSlot % 30) || 30);

    return landedNumber;
}

function sendBetToPhp(landedNumber, betAmount) {
    const formData = new FormData();
    formData.append('betting_option', selectedBettingOption);
    formData.append('bet_amount', betAmount);
    formData.append('landed_number', landedNumber);

    fetch(`../PHP Files/roulette.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        displayResult(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

function displayResult(data) {
    const resultHTML = `
        <div style="padding: 15px; background: rgba(0,0,0,0.8); border-radius: 10px; text-align: center; color: white; margin-top: 20px;">
            <h3 style="margin: 0 0 10px 0;">Result: ${data.randomNumber}</h3>
            <p style="margin: 5px 0;"><strong>Your Bet:</strong> ${data.bettingOption}</p>
            <p style="margin: 5px 0;"><strong>Bet Amount:</strong> ₱${parseFloat(data.betAmount).toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${data.won ? '✅ WON' : '❌ LOST'}</p>
            ${data.won ? `
                <p style="margin: 5px 0; color: #00ff00;"><strong>Multiplier: x${data.multiplier}</strong></p>
                <p style="margin: 5px 0; color: #00ff00; font-size: 18px;"><strong>Winnings: ₱${parseFloat(data.winnings).toFixed(2)}</strong></p>
            ` : ''}
            <p style="margin: 10px 0; font-size: 14px;">${data.message}</p>
            <button onclick="resetGame()" style="margin-top: 10px; padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Play Again</button>
        </div>
    `;

    resultDiv.innerHTML = resultHTML;
}

function resetGame() {
    const betAmountInput = document.querySelector('.betting-input input[type="text"]');
    const bettingButtons = document.querySelectorAll('.game-buttons button');

    // Clear inputs
    betAmountInput.value = '';
    selectedBettingOption = null;

    // Reset wheel rotation
    wheel.style.transform = 'rotate(0deg)';

    // Remove active class from all buttons
    bettingButtons.forEach(btn => btn.classList.remove('active'));

    // Clear result display
    resultDiv.innerHTML = '';
}
