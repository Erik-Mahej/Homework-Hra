
let playerHealth = 100;
let enemyHealth = 100;
let canHitEnemy = true; 

function updateHealthBars() {
    const playerHealthBar = document.getElementById('playerHealth');
    const enemyHealthBar = document.getElementById('enemyHealth');

    playerHealthBar.style.width = playerHealth + '%';
    enemyHealthBar.style.width = enemyHealth + '%';

    playerHealthBar.className = 'healthBar'; 
    if (playerHealth < 20) {
        playerHealthBar.classList.add('bg-danger');
    } else if (playerHealth < 50) {
        playerHealthBar.classList.add('bg-warning');
    } else {
        playerHealthBar.classList.add('bg-success');
    }

    enemyHealthBar.className = 'healthBar'; 
    if (enemyHealth < 20) {
        enemyHealthBar.classList.add('bg-danger');
    } else if (enemyHealth < 50) {
        enemyHealthBar.classList.add('bg-warning');
    } else {
        enemyHealthBar.classList.add('bg-success');
    }
}

