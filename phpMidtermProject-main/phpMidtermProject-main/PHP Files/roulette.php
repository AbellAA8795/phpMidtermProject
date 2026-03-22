<?php
header('Content-Type: application/json');

// Get the landed number from the wheel and the betting option
$landedNumber = isset($_POST['landed_number']) ? intval($_POST['landed_number']) : null;
$bettingOption = isset($_POST['betting_option']) ? trim($_POST['betting_option']) : null;
$betAmount = isset($_POST['bet_amount']) ? floatval($_POST['bet_amount']) : 0;

// Validate inputs
if (!$landedNumber || $landedNumber < 1 || $landedNumber > 30) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid wheel result'
    ]);
    exit;
}

if (!$bettingOption) {
    echo json_encode([
        'success' => false,
        'message' => 'No betting option selected'
    ]);
    exit;
}

// Use the landed number from the wheel
$randomNumber = $landedNumber;

// Determine if the user won and calculate the multiplier
$won = false;
$multiplier = 0;

switch ($bettingOption) {
    case 'Low Bet':
        $won = ($randomNumber >= 1 && $randomNumber <= 15);
        $multiplier = 2;
        break;

    case 'High Bet':
        $won = ($randomNumber >= 16 && $randomNumber <= 30);
        $multiplier = 2;
        break;

    case 'Prime':
        $primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        $won = in_array($randomNumber, $primeNumbers);
        $multiplier = 3;
        break;

    case 'Odd':
        $won = ($randomNumber % 2 != 0);
        $multiplier = 2;
        break;

    case 'Even':
        $won = ($randomNumber % 2 == 0);
        $multiplier = 2;
        break;

    case 'Time Travel':
        // This requires comparing with previous result
        // Store previous number in session
        session_start();
        if (isset($_SESSION['previous_number'])) {
            $won = ($randomNumber == $_SESSION['previous_number']);
        } else {
            $won = false;
        }
        $_SESSION['previous_number'] = $randomNumber;
        $multiplier = 30;
        break;

    case 'Peak':
        $won = ($randomNumber == 30);
        $multiplier = 30;
        break;

    case 'Valley':
        $won = ($randomNumber == 1);
        $multiplier = 30;
        break;

    case 'First Range':
        $won = ($randomNumber >= 1 && $randomNumber <= 10);
        $multiplier = 2;
        break;

    case 'Second Range':
        $won = ($randomNumber >= 11 && $randomNumber <= 20);
        $multiplier = 2;
        break;

    case 'Third Range':
        $won = ($randomNumber >= 21 && $randomNumber <= 30);
        $multiplier = 2;
        break;

    case 'Luck 7':
        if ($randomNumber == 7) {
            $won = true;
            $multiplier = 20;
        } elseif ($randomNumber % 7 == 0) {
            $won = true;
            $multiplier = 10;
        } else {
            $won = false;
            $multiplier = 0;
        }
        break;

    default:
        echo json_encode([
            'success' => false,
            'message' => 'Invalid betting option: ' . $bettingOption
        ]);
        exit;
}

// Calculate winnings
$winnings = $won ? $betAmount * $multiplier : 0;

// Prepare response
$response = [
    'success' => true,
    'randomNumber' => $randomNumber,
    'bettingOption' => $bettingOption,
    'betAmount' => $betAmount,
    'won' => $won,
    'multiplier' => $won ? $multiplier : 0,
    'winnings' => $winnings,
    'message' => $won ? "Congratulations! You won ₱" . number_format($winnings, 2) : "Sorry! You lost. The number was " . $randomNumber
];

echo json_encode($response);
?>

