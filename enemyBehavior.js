
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
        }, 300); 
    }
}

function stopIdleAnimation() {
    
    clearInterval(idleAnimationInterval);
    idleAnimationInterval = null; 
}

function showHitAnimation() {
    
    const hitImages = ['MikeSprite/hit1.png', 'MikeSprite/hit2.png'];
    const randomHitImage = hitImages[Math.floor(Math.random() * hitImages.length)];
    
    
    enemy.style.backgroundImage = `url('${randomHitImage}')`;
    
    
    setTimeout(() => {
        if (!isDefending) {
            enemy.style.backgroundImage = "url('MikeSprite/idle1.png')"; 
        } else {
            enemy.style.backgroundImage = "url('MikeSprite/MikeDefend.png')"; 
        }
    }, 500); 
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
    }, 5000); 
}


enemy.addEventListener('click', function() {
    const blockChance = 0.5; 
    const randomValue = Math.random(); 

    if (isDefending) {
        actionMessage.innerText = 'The enemy is defending! You cannot hit them.';
    } else if (!canHitEnemy) {
        actionMessage.innerText = 'You need to wait before hitting again!';
    } else if (randomValue < blockChance) {
        actionMessage.innerText = 'The enemy blocked your attack!'; 
        enemy.style.backgroundImage = "url('MikeSprite/MikeDefend.png')"; 
        setTimeout(() => {
            enemy.style.backgroundImage = "url('MikeSprite/idle1.png')"; 
        }, 500); 
    } else {
        actionMessage.innerText = 'You hit the enemy!'; 
        enemyHealth -= 10; 
        if (enemyHealth < 0) enemyHealth = 0; 
        updateHealthBars(); 
        showHitAnimation(); 
        canHitEnemy = false; 
        setTimeout(() => {
            canHitEnemy = true; 
        },  1000); 
    }
});

function enemyAttack() {
    if (!isDefending) {
        
        const attackWarning = document.getElementById('attackWarning');
        attackWarning.style.display = 'block'; 

        
        setTimeout(() => {
            
            const attackImages = ['MikeSprite/attack1.png', 'MikeSprite/attack2.png'];
            const randomAttackImage = attackImages[Math.floor(Math.random() * attackImages.length)];

           
            enemy.style.backgroundImage = `url('${randomAttackImage}')`; 

            
            playerHealth -= 10; 
            console.log('Mike Tyson attacked! Player health:', playerHealth);
            updateHealthBars(); 

            
            if (playerHealth <= 0) {
                alert('You lost!'); 
                resetGame(); 
            }

            
            attackWarning.style.display = 'none'; 

            
            stopIdleAnimation();
            startTauntAnimation();

           
            setTimeout(() => {
                enemy.style.backgroundImage = "url('MikeSprite/idle1.png')"; 
                startIdleAnimation(); 
            }, 2000); 
        }, 500); 
    }
}

function startTauntAnimation() {
    const tauntImages = ['MikeSprite/Taunt1.png', 'MikeSprite/Taunt2.png'];
    let tauntIndex = 0;
    let tauntCount = 0;
    const tauntInterval = setInterval(() => {
        enemy.style.backgroundImage = `url('${tauntImages[tauntIndex]}')`;
        tauntIndex = (tauntIndex + 1) % tauntImages.length;

        
        if (tauntIndex === 0) {
            tauntCount++;
        }
        if (tauntCount === 2) {
            clearInterval(tauntInterval); 
        }
    }, 300); 
}

setInterval(enemyAttack, 3000); 


startIdleAnimation();