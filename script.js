document.getElementById('add-player').addEventListener('click', addPlayerHand);
document.getElementById('evaluate-hands').addEventListener('click', evaluateHands);

function addPlayerHand() {
    const playerHands = document.getElementById('player-hands');
    const playerHandDiv = document.createElement('div');
    playerHandDiv.className = 'player-hand';
    playerHandDiv.innerHTML = `
        <input type="text" class="player-card" maxlength="2" placeholder="Card 1 (e.g. AC)">
        <input type="text" class="player-card" maxlength="2" placeholder="Card 2 (e.g. 9H)">
    `;
    playerHands.appendChild(playerHandDiv);
}

function evaluateHands() {
    const communityCards = getCommunityCards();
    const playerHands = getPlayerHands();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    let bestHand = null;
    let bestHandValue = -1;

    playerHands.forEach((hand, index) => {
        const fullHand = communityCards.concat(hand);
        const handValue = evaluateHand(fullHand);
        if (handValue > bestHandValue) {
            bestHandValue = handValue;
            bestHand = `Player ${index + 1} with hand ${hand.join(', ')}`;
        }
    });

    resultsDiv.textContent = `Best Hand: ${bestHand}`;
}

function getCommunityCards() {
    const communityCards = [];
    for (let i = 1; i <= 5; i++) {
        const card = document.getElementById(`community${i}`).value;
        if (card) communityCards.push(card.toUpperCase());
    }
    return communityCards;
}

function getPlayerHands() {
    const playerHands = [];
    document.querySelectorAll('.player-hand').forEach(handDiv => {
        const hand = [];
        handDiv.querySelectorAll('.player-card').forEach(cardInput => {
            const card = cardInput.value;
            if (card) hand.push(card.toUpperCase());
        });
        if (hand.length === 2) playerHands.push(hand);
    });
    return playerHands;
}

// Improved hand evaluation function
function evaluateHand(cards) {
    const values = cards.map(card => '23456789TJQKA'.indexOf(card[0]));
    const suits = cards.map(card => card[1]);

    values.sort((a, b) => a - b);

    const isFlush = suits.every(suit => suit === suits[0]);

    const isStraight = values.every((value, index) => {
        if (index === 0) return true;
        return value === values[index - 1] + 1;
    });

    const valueCounts = {};
    values.forEach(value => {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    const counts = Object.values(valueCounts).sort((a, b) => b - a);

    if (isFlush && isStraight) return 8;
    if (counts[0] === 4) return 7;
    if (counts[0] === 3 && counts[1] === 2) return 6;
    if (isFlush) return 5;
    if (isStraight) return 4;
    if (counts[0] === 3) return 3;
    if (counts[0] === 2 && counts[1] === 2) return 2;
    if (counts[0] === 2) return 1;

    return 0;
}
