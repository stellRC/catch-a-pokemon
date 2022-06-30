const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const level = document.querySelector('.level-number');
const startBtn = document.querySelector('.btn-start');
const hamburger = document.querySelector('.hamburger');
const scoreboard = document.querySelector('.scoreboard');
const addItems = document.querySelector('.add-items');
const itemsList = document.querySelector('.score-list');
const form = document.querySelector('form');
let lastHole;
let timeUp = false;
let score = 0;
let levelNumber = 1;
let time;

let pokemonSpriteFront;
let randomId;

let scoreInput;
let levelInput;

const items = JSON.parse(localStorage.getItem('items')) || [];


const fetchPokemon = async (id) => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
       
        const pokemonImageFront = data.sprites.front_default;

        pokemonSpriteFront = `url(${pokemonImageFront})`;
        moles.forEach(mole => mole.style.backgroundImage = pokemonSpriteFront);
        // console.log((data.types[0].type.name))

        if((data.types[0].type.name) === 'water')  {
            holes.forEach(hole => hole.style.setProperty('--dirt', 'url(img/water.png)'))
        } else {
            holes.forEach(hole => hole.style.setProperty('--dirt', 'url(img/dirt.svg)'))
        }

    } catch (err) {
        console.error(err);
    }
}


function addItem(e) {
    this.classList.remove('visible');
    this.classList.add('hidden')
   
    e.preventDefault();
    const text = this.querySelector('[name=item]').value;
    scoreInput = score;
    levelInput = levelNumber;
    const item = {
        text,
        scoreInput,
        levelInput,
        done: false
    };
    
    items.push(item);
    populateList(items, itemsList)
    localStorage.setItem('items', JSON.stringify(items))
    this.reset();
}

function populateList(pokemons = [], pokemonList) {
    pokemonList.innerHTML = pokemons.map((pokemon, i) => {
        return `
            <li data-index=${i}>
                <span data-index=${i} id="item${i}">Level: ${pokemon.levelInput}</span>
                <span data-index=${i} id="item${i}">Score: ${pokemon.scoreInput}</span>
                <label for="item${i}">${pokemon.text}</label>
            </li>
        `;
    }).join('');
}


function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// random dom element
function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
  
    if(hole === lastHole) {
          // recursion
        return randomHole(holes)
    }

// save reference to what popped up last time so number does not repeat
    lastHole = hole;
    return hole;
}

function peep() {

    time = randomTime(800, 1000);

    const hole = randomHole(holes);
    hole.classList.add('up')
    setTimeout(() => {
        hole.classList.remove('up');
        // will run forever if you don't have if statement with timeup set to true
        if(!timeUp) peep();
    }, time);
    
    levelUp()
}

function levelUp() {
    if(score >= (levelNumber)) {
        levelNumber++;
        level.textContent = levelNumber;

        console.log('cat')
        startGame();
        
    } 
    
   
}

function randomPokemon() {
    min = Math.ceil(1);
    max = Math.floor(100);
    randomId = Math.floor(Math.random() * (max - min) + min);

    fetchPokemon(randomId)
}

function startGame() {
  
    randomPokemon();

    scoreBoard.textContent = 0;
    level.textContent = levelNumber;

    // if want to play twice, this needs to be declared here and at top
    timeUp = false;
    score = 0;
    peep();
    setTimeout(()=> timeUp = true, 10000);
}


function startGameBtn() {
    levelNumber = 1;
    level.textContent = levelNumber;
    form.classList.remove('hidden')
    form.classList.add('visible');
    startGame();
}


function bonk(e) {
    // can fake click with javasccript
    // when you do so, isTrusted will equal false rather than when you click with mouse it will equal true
    if(!e.isTrusted) return;
    score++;
    this.classList.remove('up');
    scoreBoard.textContent = score;
}

addItems.addEventListener('submit', addItem)
startBtn.addEventListener('click', startGameBtn)
moles.forEach(mole => mole.addEventListener('click', bonk))
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    scoreboard.classList.toggle('open');
})
populateList(items, itemsList);

// all time scoreboard saved in local storage


