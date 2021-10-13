let r, g, b
let brain
let match

function pickColor() {
    r = random(255)
    g = random(255)
    b = random(255)

    colorPredictor();
    redraw();
}


function getButton(label, pos) {
    button = createButton(label)
    button.position(pos[0], pos[1])
    button.mouseReleased(pickColor)
}

function setup() {
    new Promise(resolve => {
        $.post(`db-connection.php`, { data: null, operation: 'load' }, function (response) { resolve(response) })

    }).then(x => {
        if(x.length > 1) {
            brain = NeuralNetwork.deserialize(x)
            console.log(brain)
            console.log('Log: data loaded from database')
        } else {
            brain = new NeuralNetwork(3, 3, 2)
            console.log('Warning: New data will be created in database')
        }
        createCanvas(window.innerWidth, window.innerHeight)
        noLoop()
        getButton('BLACK', [(window.innerWidth / 10) * 2, window.innerHeight / 10 * 8])
        getButton('SKIP', [(window.innerWidth / 10) * 4.5, window.innerHeight / 10 * 8])
        getButton('WHITE', [(window.innerWidth / 10) * 7, window.innerHeight / 10 * 8])
        addButtonsListeners()
        pickColor()
    })
}

function addButtonsListeners() {
    let buttons = document.querySelectorAll('button')
    buttons[0].addEventListener('click', () => { processClick([1, 0]) })
    buttons[1].addEventListener('click', () => { pickColor() })
    buttons[2].addEventListener('click', () => { processClick([0, 1]) })
}

function processClick(targets) {
    let inputs = [r / 255, g / 255, b / 255]
    brain.train(inputs, targets)
    $.post(`db-connection.php`, { data: brain.serialize(), operation: 'save' }, function (response) { console.log(response); })
}


function draw() {
    background(r, g, b)
    drawProbability()
}

function drawProbability() {
    noStroke();
    textSize(65)
    textAlign(CENTER, CENTER)
    fill(0)
    rect(window.innerWidth / 10 * 2.5, window.innerHeight / 10 * 1.5, window.innerWidth / 10 * 0.1, window.innerHeight / 10 * 5.5)
    fill(255)
    rect(window.innerWidth / 10 * 7.5, window.innerHeight / 10 * 1.5, window.innerWidth / 10 * 0.1, window.innerHeight / 10 * 5.5)
    fill(match ? 0 : 255)
    text('TRAIN ME', window.innerWidth / 10 * 5, window.innerHeight / 10 * 0.8)
}

function colorPredictor() {
    let inputs = [r / 255, g / 255, b / 255]
    let outputs = brain.predict(inputs)
    if (outputs[0] > outputs[1]) {
        match = true
    } else {
        match = false
    }
}