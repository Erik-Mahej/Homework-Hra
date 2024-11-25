const cutsceneImage = document.getElementById('cutsceneImage');
const actionMessage = document.getElementById('actionMessage');
const startButton = document.getElementById('startButton');
const startSlider = document.getElementById('sliderbox');
const playerElement = document.getElementById('player');
const cutscene = document.getElementById('cutscene');
const gameArea = document.getElementById('gameArea');
const enemy = document.getElementById('enemy');
const RIGHT_BOUNDARY = DODGE_DISTANCE;
const LEFT_BOUNDARY = -DODGE_DISTANCE; 
const DODGE_DISTANCE = 200; 
const dodgeChance = 0.7;


let playerIdleAnimationInterval = null;
let idleAnimationInterval = null; 
let currentIdleImageIndex = 0;
let playerIsDefending = false; 
let playerIdleImageIndex = 0;
let currentDodgePosition = 0; 
let isEnemyAnimating = false; 
let enemyAttackPower = 10; 
let enemyHasLost = false; 
let enemyAttackInterval; 
let defendCycleInterval; 
let gameStarted = false; 
let isDefending = false;
let playerHealth = 100;
let gameOver = false; 
let enemyHealth = 100; 
let Chance = 0.5; 
let canHitEnemy = true;

const idleImages = [
    'MikeSprite/idle1.png',
    'MikeSprite/idle2.png',
    'MikeSprite/idle3.png',
    'MikeSprite/idle4.png',
    'MikeSprite/idle5.png',
    'MikeSprite/idle6.png',
    'MikeSprite/idle7.png'
];
const playerIdleImages = [
    'PlayerSprite/idle1.png',
    'PlayerSprite/idle2.png',
    'PlayerSprite/idle3.png',
    'PlayerSprite/idle4.png',
    'PlayerSprite/idle5.png'
];
const refereeImages = [
    'assets/referee1.png',
    'assets/referee2.png',
    'assets/referee3.png',
    'assets/referee4.png'
];





//funkce na health bary
function updateHealthBars() {
    const playerHealthBar = document.getElementById('playerHealth');
    const enemyHealthBar = document.getElementById('enemyHealth');

    //nastavi pocet hp na %
    playerHealthBar.style.width = playerHealth + '%';

    const enemyHealthPercentage = Math.min(enemyHealth, 100); 
    enemyHealthBar.style.width = enemyHealthPercentage + '%'; 

    //tady se meni barvy podle toho kolik hp maji
    if (playerHealth < 50) playerHealthBar.style.backgroundColor = 'orange';
    if (playerHealth < 20) playerHealthBar.style.backgroundColor = 'red';
    if (enemyHealthPercentage < 50) enemyHealthBar.style.backgroundColor = 'orange';
    if (enemyHealthPercentage < 20) enemyHealthBar.style.backgroundColor = 'red';

    //kontrola jestli neni nekdo dead
    if (enemyHealth <= 0) {
        enemyHealth = 0; 
        enemyLoses(); 
    }
    if (playerHealth <= 0) {
        playerHealth = 0; 
        playerLoses(); 
    }
}


//slider na zacatku co nastavuje difficulty
const difficultySlider = document.getElementById('difficultySlider');
const difficultyValueDisplay = document.getElementById('difficultyValue');

difficultySlider.addEventListener('input', function() {
    difficultyValueDisplay.innerText = this.value;
});


//start hry pomoci tlacitka

startButton.addEventListener('click', startGame);

function startGame() {
    startButton.style.display = 'none'; 
    startSlider.style.display = 'none'; 
    document.getElementById('startImage').style.display = 'none'; 
    cutscene.style.display = 'block'; 
    playCutscene(); //zahraje se cutscena
    //tady se nastavuje difficulty enemy
    const difficultyLevel = parseInt(difficultySlider.value);   //tady se nastavuje difficulty enemy
    adjustEnemyDifficulty(difficultyLevel);
}

//funkce na difficulty

function adjustEnemyDifficulty(difficultyLevel) {
    enemyHealth = 100 + (difficultyLevel * 10); 
    enemyAttackPower = 10 + difficultyLevel; 
    enemyBlockChance = 0 + (difficultyLevel * 0.05); 

    console.log(`Enemy Health: ${enemyHealth}, Enemy Attack Power: ${enemyAttackPower}, Enemy Block Chance: ${enemyBlockChance}`);
}

function playCutscene() {
    let cutsceneImages = [
        'assets/intro2.png',
        'assets/intro3.png'
    ];
    
    let currentImageIndex = 0;
    cutsceneImage.src = cutsceneImages[currentImageIndex];

    const cutsceneInterval = setInterval(() => {
        currentImageIndex++;
        if (currentImageIndex < cutsceneImages.length) {
            cutsceneImage.src = cutsceneImages[currentImageIndex];
        } else {
            clearInterval(cutsceneInterval);
            cutscene.style.display = 'none'; 
            gameArea.style.display = 'block'; 
            showRefereeImages(); //rozhodci mario
        }
    }, 2000);
}

function showRefereeImages() {
    let currentRefereeImageIndex = 0;
    const refereeDiv = document.getElementById('referee');
    const refereeImageElement = document.getElementById('refereeImage');

    refereeDiv.style.display = 'block'; //objevi se

    const refereeInterval = setInterval(() => {
        if (currentRefereeImageIndex < refereeImages.length) {
            refereeImageElement.src = refereeImages[currentRefereeImageIndex];
            currentRefereeImageIndex++;
        } else {
            clearInterval(refereeInterval);
            refereeDiv.style.display = 'none'; //zmizi potom co se zobrazi
            initializeGame(); //tady zacne boj
        }
    }, 1000); //rychlost cutscen
}

function initializeGame() {
    resetGame(); //jistota aby vsechny hodnoty byly spravne
    gameStarted = true; 
    enemyHasLost = false; //tyhle promnene mam sice vickrat ale jsou potrebny pro stav hry
    startIdleAnimation();
    startPlayerIdleAnimation();
    startAttackDefenseCycle(); 
    enemyAttackInterval = setInterval(enemyAttack, 4000); //rychlost utoku
}

function resetGame() {
    document.getElementById('playerHealth').style.width = playerHealth + '%';
    document.getElementById('enemyHealth').style.width = enemyHealth + '%'; 
    document.getElementById('actionMessage').innerText = '';
}

//funkce pro start a pro konec animace
function startIdleAnimation() {
    if ( isEnemyAnimating || !gameStarted || gameOver || enemyHasLost) return; //kontrola vsech podminek aby se funkce nezapinala kdyz nema
    if (!idleAnimationInterval) {
        idleAnimationInterval = setInterval(() => {
            if (!isDefending) { 
                enemy.style.backgroundImage = `url('${idleImages[currentIdleImageIndex]}')`;
                currentIdleImageIndex = (currentIdleImageIndex + 1) % idleImages.length; 
            }
        }, 300); 
    }
    console.log("Enemy idle animation started.");
}

function stopIdleAnimation() {
    clearInterval(idleAnimationInterval);
    idleAnimationInterval = null; 
}


//podobna funkce pro hrace
function startPlayerIdleAnimation() {
    if (!gameStarted || gameOver) return;
    if (!playerIdleAnimationInterval) {
        playerIdleAnimationInterval = setInterval(() => {
            playerElement.style.backgroundImage = `url('${playerIdleImages[playerIdleImageIndex]}')`;
            playerIdleImageIndex = (playerIdleImageIndex + 1) % playerIdleImages.length;
        }, 500); //rychlost zmeny
    }
    console.log("Player idle animation started.");
}

function stopPlayerIdleAnimation() {
    clearInterval(playerIdleAnimationInterval);
    playerIdleAnimationInterval = null;
}

//funkce pro enemy kdy po nejakem case zacne defendit a jak dlouho
function startAttackDefenseCycle() {
    if (!gameStarted || gameOver) return;
    defendCycleInterval = setInterval(() => {
        if (!isDefending || gameOver || isEnemyAnimating ) {
            isDefending = true;
            stopIdleAnimation(); 
            actionMessage.innerText = 'Enemy is defending!';
            enemy.style.backgroundImage = "url('MikeSprite/MikeDefend.png')"; 
            setTimeout(() => {
                isDefending = false;
                startIdleAnimation(); 
            }, 1500); //jak dlouho defendi
        }
    }, 5000);//jak casto defendi
    console.log("Attack and defense cycle started.");
}



//event listener pro utok hrace tlacitkem mysi
enemy.addEventListener('click', function() {
    const blockChance = 0.25; 
    const randomValue = Math.random(); 
    if (!gameStarted || enemyHasLost) return;
    if (isDefending) {
        actionMessage.innerText = 'The enemy is defending! You cannot hit them.';
    } else {
        const randomValue = Math.random(); 

        if (randomValue < blockChance) {
            console.log("The enemy dodged the attack!"); 
            dodge();
        } else {
            actionMessage.innerText = 'You hit the enemy!'; 
            enemyHealth -= 5; // dmg hrace
            if (enemyHealth < 0) enemyHealth = 0; 
            updateHealthBars();
            stopIdleAnimation();
            showHitAnimation();  //ukaze se animace enemy
            showPlayerAttackAnimation(); //ukaze se animace hrace
        }
    }
});


function showHitAnimation() {
    if (enemyHasLost || !gameStarted) return; //kontrola zase byl to casty bug
    isEnemyAnimating = true; //promena aby se neprerusila animace
    stopIdleAnimation();

    const hitImages = ['MikeSprite/hit1.png', 'MikeSprite/hit2.png'];
    const randomHitImage = hitImages[Math.floor(Math.random() * hitImages.length)];
    enemy.style.backgroundImage = `url('${randomHitImage}')`;

    //tady je sance na dodge enemy potom co dostane hit
    const direction = Math.random() < 0.5 ? -1 : 1; //nahodne se vybere prava nebo leva
    const newPosition = currentDodgePosition + (direction * DODGE_DISTANCE);

    //kontrola aby se enemy nehybal mimo arenu
    if (newPosition >= LEFT_BOUNDARY && newPosition <= RIGHT_BOUNDARY) {
        currentDodgePosition = newPosition; //premena pozice
        enemy.style.transition = 'transform 0.3s'; 
        enemy.style.transform = `translateX(${currentDodgePosition}px)`; 
    }

    setTimeout(() => {
        isEnemyAnimating = false;
        startIdleAnimation();
    }, 500); //jak dlouha je animace hitu
}

//funkce na dodge

function dodge() {
    if (!gameStarted) return; //bezpecnostni podminka

    const direction = Math.random() < 0.5 ? -1 : 1; 
    const newPosition = currentDodgePosition + (direction * DODGE_DISTANCE);

    if (newPosition >= LEFT_BOUNDARY && newPosition <= RIGHT_BOUNDARY) {
        currentDodgePosition = newPosition; 
        enemy.style.transition = 'transform 0.3s'; 
        enemy.style.transform = `translateX(${currentDodgePosition}px)`; // Move to new position
        
        
        setTimeout(() => {
            // tady muzu dat aby po nejakem case sam dodgoval
            dodge();
        }, 2000); 
    }
}

enemy.addEventListener('mouseover', function() {
    
    if (Math.random() < dodgeChance) {
        actionMessage.innerText = 'Mike dodged your attack!';
        dodge(); 
    } 
});


//animace hrace na utok

function showPlayerAttackAnimation() {
    if (!gameStarted) return;
    const playerAttackImages = ['PlayerSprite/attack.png'];
    const randomAttackImage = playerAttackImages[Math.floor(Math.random() * playerAttackImages.length)]; //puvodne tu melo byt vic obrazku
    playerElement.style.backgroundImage = `url('${randomAttackImage}')`;

    //reset na idle animaci
    setTimeout(() => {
        startPlayerIdleAnimation();
    }, 500); //po jake dobe je reset
}

//funkce co zarizuji ze hrac defendi jen kdyz drzi mezernik

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        defend();
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        stopDefend();
    }
});

function defend() {
    if (!playerIsDefending) { 
        playerIsDefending = true; 
        stopPlayerIdleAnimation(); 
        playerElement.style.backgroundImage = "url('PlayerSprite/defend.png')"; 
        actionMessage.innerText = 'You are defending!';
    }
}

function stopDefend() {
    if (playerIsDefending) { 
        playerIsDefending = false; 
        playerElement.style.backgroundImage = `url('${playerIdleImages[playerIdleImageIndex]}')`; 
        actionMessage.innerText = 'You are no longer defending.';
        startPlayerIdleAnimation(); 
    }
}




function enemyAttack() {
    if (!gameStarted || gameOver || isEnemyAnimating) return;
    stopIdleAnimation();
    isEnemyAnimating = true;

    const attackWarning = document.getElementById('attackWarning'); //varovani ten cerveny vykricnik
    attackWarning.style.display = 'block'; 

    setTimeout(() => {
        const attackImages = ['MikeSprite/attack1.png', 'MikeSprite/attack2.png'];
        const randomAttackImage = attackImages[Math.floor(Math.random() * attackImages.length)];
        enemy.style.backgroundImage = `url('${randomAttackImage}')`; 
        if (!playerIsDefending) {
            playerHealth -= enemyAttackPower;
            updateHealthBars();
        }
        attackWarning.style.display = 'none'; 
        setTimeout(() => {
            isEnemyAnimating = false;
            startIdleAnimation();
        }, 500); //delka animace utoku
            
        
    }, 1000); //cas pred tim nez zautoci
}



function playerLoses() {
    cancelAllAnimations(); //vypne vsechny animace
    gameStarted = false; 
    gameOver = true; 

    //ukaze porazeneho hrace
    playerElement.style.backgroundImage = "url('PlayerSprite/defeat.png')";
    const refereeImageElement = document.getElementById('refereeImage');
    refereeImageElement.src = 'assets/referee5.png'; //mario rekne KO
    document.getElementById('referee').style.display = 'block'; //ukaze to maria

    //taunt animace mika
    startTauntAnimation();

    //cekacka 5 sekund na konec
    setTimeout(() => {
        gameArea.style.display = 'none'; 
        document.getElementById('playerLoseImage').style.display = 'block'; 
        console.log("Player has lost the game!");
    }, 5000);
}

//druha funkce je stejne jen pro enemy
function enemyLoses() {
    cancelAllAnimations(); 
    gameStarted = false; 
    gameOver = true; 
    enemyHasLost = true; 
    console.log("Enemy has lost it!");
    enemy.style.backgroundImage = "url('MikeSprite/defeat.png')";

    const refereeImageElement = document.getElementById('refereeImage');
    refereeImageElement.src = 'assets/referee5.png'; 
    document.getElementById('referee').style.display = 'block'; 

    setTimeout(() => {
        gameArea.style.display = 'none'; 
        document.getElementById('enemyLoseImage').style.display = 'block'; 

        console.log("Enemy has lost the game!");
    }, 5000);
}


//taunt animace aby dvakrat zatnul biceps
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



setInterval(enemyAttack, 3500);// jak casto utoci



//funkce na ukonceni kompletne vsech animaci 

function cancelAllAnimations() {
    stopPlayerIdleAnimation();
    stopIdleAnimation();
    clearInterval(enemyAttackInterval);
    clearInterval(defendCycleInterval);
    
    playerIsDefending = false;
    isDefending = false;
    canHitEnemy = true;
    resetGame();
    actionMessage.innerText = 'All animations canceled.';
}