// Duck functions
let ducks = [];
let mouseX = 0;
let mouseY = 0;
let duckCounter = 0;
let currentSpeed = 8; // Starting speed

window.onload = function() {
    display = document.getElementById('display');
    const weatherResult = document.getElementById('weather-result');
    if (weatherResult) {
        weatherResult.style.display = 'none';
    }

    // Initialize first duck
    const firstDuck = document.getElementById('duck');
    if (firstDuck) {
        firstDuck.dataset.speed = currentSpeed;
        ducks.push(firstDuck);
        positionDuck(firstDuck);
        
        // Track mouse/touch movement
        document.addEventListener('mousemove', updateMousePosition);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        // Add click/touch listeners to create ducks
        document.addEventListener('click', createDuckAtPosition);
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Start duck chase
        setInterval(updateDucks, 20);
    }
}

function handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling while moving
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        updateMousePosition(touch);
    }
}

function handleTouchEnd(event) {
    event.preventDefault();
    if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        createDuckAtPosition(touch);
    }
}

function updateMousePosition(event) {
    const x = event.clientX || event.pageX;
    const y = event.clientY || event.pageY;
    if (x !== undefined && y !== undefined) {
        mouseX = x;
        mouseY = y;
    }
}

function positionDuck(duck, x, y) {
    if (x === undefined || y === undefined) {
        x = Math.random() * (window.innerWidth - 40); // Account for smaller duck size
        y = Math.random() * (window.innerHeight - 40);
    }
    duck.style.left = x + 'px';
    duck.style.top = y + 'px';
}

function updateDucks() {
    ducks.forEach(duck => chaseMouse(duck));
}

function chaseMouse(duck) {
    if (!duck) return;

    const duckRect = duck.getBoundingClientRect();
    const duckX = duckRect.left;
    const duckY = duckRect.top;

    // Calculate direction to mouse
    const dx = mouseX - duckX;
    const dy = mouseY - duckY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only move if mouse is far enough
    if (distance > 5) {
        // Add walking animation
        duck.classList.add('walking');

        // Flip duck based on direction
        if (dx < 0) {
            duck.style.transform = 'scaleX(-1)';
        } else {
            duck.style.transform = 'scaleX(1)';
        }

        // Get this duck's speed
        const speed = parseFloat(duck.dataset.speed);
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        // Update duck position with smooth transition
        duck.style.transition = 'left 0.1s, top 0.1s';
        duck.style.left = (duckX + moveX) + 'px';
        duck.style.top = (duckY + moveY) + 'px';
    } else {
        duck.classList.remove('walking');
    }
}

function createDuckAtPosition(event) {
    // Don't create duck if clicking on interactive elements
    const target = event.target || event.srcElement;
    if (target.tagName.toLowerCase() === 'input' || 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a') {
        return;
    }

    // Play quack sound
    try {
        const audio = new Audio('https://www.myinstants.com/media/sounds/quack.mp3');
        audio.play().catch(() => {}); // Ignore autoplay restrictions
    } catch (e) {
        // Ignore audio errors on mobile
    }

    // Increase speed for all existing ducks
    currentSpeed = Math.min(currentSpeed * 1.5, 100);
    ducks.forEach(duck => {
        duck.dataset.speed = currentSpeed;
    });

    // Create new duck
    const newDuck = document.createElement('img');
    duckCounter++;
    newDuck.id = 'duck' + duckCounter;
    newDuck.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdc0u_o9rTcpo572jdB5FZyu1u3VMPCUM2PQgr7oJaMs6_gb-ykrA1uv8HxRn9wZPtGM&usqp=CAU';
    newDuck.alt = 'A cute duck';
    newDuck.className = 'duck';
    newDuck.dataset.speed = currentSpeed;
    
    // Position new duck at click/touch position
    newDuck.style.position = 'fixed';
    const x = event.clientX || event.pageX || (event.touches && event.touches[0].pageX);
    const y = event.clientY || event.pageY || (event.touches && event.touches[0].pageY);
    positionDuck(newDuck, x - 20, y - 20); // Center duck on touch (smaller size)
    
    // Add to document and duck array
    document.body.appendChild(newDuck);
    ducks.push(newDuck);

    // Update waddle animation speed based on current speed
    document.documentElement.style.setProperty('--waddle-speed', Math.max(0.1, 0.5 - (currentSpeed / 200)) + 's');
}

// Keep all existing functions below this line
function changeColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('h1').style.color = randomColor;
}

function teleport(button) {
    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    button.style.position = 'fixed';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
}

let display;
let currentValue = '';

// Calculator functions
function appendNumber(num) {
    currentValue += num;
    display.value = currentValue;
}

function appendOperator(op) {
    if (currentValue !== '' && !isOperator(currentValue.slice(-1))) {
        currentValue += op;
        display.value = currentValue;
    }
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function clearDisplay() {
    currentValue = '';
    display.value = '';
}

function calculate() {
    try {
        currentValue = eval(currentValue).toString();
        display.value = currentValue;
    } catch (error) {
        display.value = 'Error';
        currentValue = '';
    }
}

// Weather functions
async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const weatherResult = document.getElementById('weather-result');
    const loadingMessage = document.getElementById('loading-message');
    
    if (!cityInput || !weatherResult) return;
    
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    // Show loading message
    loadingMessage.style.display = 'block';
    weatherResult.style.display = 'none';

    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        const current = data.current_condition[0];
        
        weatherResult.innerHTML = `
            <h2>${city}</h2>
            <img src="${current.weatherIconUrl[0].value}" alt="${current.weatherDesc[0].value}">
            <p class="temperature">${current.temp_C}°C</p>
            <p class="condition">${current.weatherDesc[0].value}</p>
            <div class="weather-details">
                <p>Humidity: ${current.humidity}%</p>
                <p>Wind: ${current.windspeedKmph} km/h</p>
                <p>Feels like: ${current.FeelsLikeC}°C</p>
            </div>
        `;
        
        weatherResult.style.display = 'block';
    } catch (error) {
        weatherResult.innerHTML = `
            <p class="error">Error: Could not fetch weather data</p>
            <p>Please try again with a valid city name.</p>
        `;
        weatherResult.style.display = 'block';
    } finally {
        loadingMessage.style.display = 'none';
    }
}

function simulateWeather(city) {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
    return {
        temp: Math.floor(Math.random() * 30) + 10,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 50) + 30
    };
}
