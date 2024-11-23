
let playerHealth = 100;
let enemyHealth = 100;
let canHitEnemy = true;


function updateHealthBars() {
    const playerHealthBar = document.getElementById('playerHealth');
    const enemyHealthBar = document.getElementById('enemyHealth');

    playerHealthBar.style.width = playerHealth + '%';
    enemyHealthBar.style.width = enemyHealth + '%';

    
    if (playerHealth < 50) playerHealthBar.style.backgroundColor = 'orange';
    if (playerHealth < 20) playerHealthBar.style.backgroundColor = 'red';
    if (enemyHealth < 50) enemyHealthBar.style.backgroundColor = 'orange';
    if (enemyHealth < 20) enemyHealthBar.style.backgroundColor = 'red';
}

