
const enemy = document.getElementById('enemy');
const actionMessage = document.getElementById('actionMessage');
let isDefending = false;
let currentIdleImageIndex = 0;
let idleAnimationInterval = null; 
const idleImages = [
    'MikeSprite/idle1.png',
    'MikeSprite/idle2.png',
    'MikeSprite/idle3.png',
    'MikeSprite/idle4.png',
    'MikeSprite/idle5.png',
    'MikeSprite/idle6.png',
    'MikeSprite/idle7.png'
];

function startIdleAnimation() {
    
    if (!idleAnimationInterval) {
        idleAnimationInterval = setInterval(() => {
            if (!isDefending) { 
                enemy.style.backgroundImage = `url('${idleImages[currentIdleImageIndex]}')`;
                currentIdleImageIndex = (currentIdleImageIndex + 1) % idleImages.length; 
            }
        }, 200); 
    }
}

function stopIdleAnimation() {
   
    clearInterval(idleAnimationInterval);
    idleAnimationInterval = null; 
}

function startAttackDefenseCycle() {
    setInterval(() => {
        if (!isDefending) {
            isDefending = true;
            stopIdleAnimation(); 
            actionMessage.innerText = 'Enemy is defending!';
            enemy.style.backgroundImage = "url('MikeSprite/MikeDefend.png')"; 
            setTimeout(() => {
                isDefending = false;
                actionMessage.innerText = 'Enemy is attacking!';
                enemy.style.backgroundImage = "url('MikeSprite/idle1.png')"; 
                startIdleAnimation(); 
            }, 2000); 
        }
    }, 10000); 
}


enemy.addEventListener('click', function() {
    if (isDefending) {
        actionMessage.innerText = 'The enemy is defending! You cannot hit them.';
    } else if (!canHitEnemy) {
        actionMessage.innerText = 'You need to wait before hitting again!';
    } else {
        actionMessage.innerText = 'You hit the enemy!'; 
        enemyHealth -= 10; 
        if (enemyHealth < 0) enemyHealth = 0; 
        updateHealthBars(); 
        canHitEnemy = false; 
        setTimeout(() => {
            canHitEnemy = true; 
        }, 1000); 
    }
});


startIdleAnimation();