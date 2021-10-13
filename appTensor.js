let r, g, b, tone, data, color, userId, write
var appFire, dbFire
var myStorage = window.localStorage


write = true


const getHttpRequest2 = (method, url, data) => {
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { "Content-Type": "application/json" } : {}
    }).then(response => {
        return response.json();
    })
};

const getId = () => {
    getHttpRequest2('GET', "https://www.uuidtools.com/api/generate/v1")
        .then(responseData => {
            let readId = myStorage.getItem('userId')
            if (readId === null) {
                userId = responseData[0]
                saveCacheData('userId', userId)
                console.log('new user id cached: \n', userId)
            } else {
                userId = readId
                console.log('registered user id loaded: \n', userId)
            }
        })
};

const saveCacheData = (key, value) => {
    try {
        myStorage.setItem(key, value)
    } catch (error) {
        console.log(error)
    }
    console.log('saving data in cache: \n', key + ':\n', value)
}

function setup() {
    getId()
    const firebaseConfig = {
        apiKey: "AIzaSyALJK23uLX46X1wNR_lDJzdLEahoW7IEtU",
        authDomain: "color-data-a1f4c.firebaseapp.com",
        projectId: "color-data-a1f4c",
        storageBucket: "color-data-a1f4c.appspot.com",
        messagingSenderId: "930703974581",
        appId: "1:930703974581:web:bc1046424d31729f135efc",
        measurementId: "G-1RGVF8Y3ND"
    };

    //Initialize Firebase
    appFire = firebase.initializeApp(firebaseConfig)
    dbFire = firebase.database()

    noLoop()
    createCanvas(window.innerWidth, window.innerHeight)
    getButton('red-ish', [(window.innerWidth / 10) * 2, window.innerHeight / 8 * 1])
    getButton('green-ish', [(window.innerWidth / 10) * 6, window.innerHeight / 8 * 1])
    getButton('blue-ish', [(window.innerWidth / 10) * 2, window.innerHeight / 8 * 2])
    getButton('orange-ish', [(window.innerWidth / 10) * 6, window.innerHeight / 8 * 2])
    getButton('yellow-ish', [(window.innerWidth / 10) * 2, window.innerHeight / 8 * 3])
    getButton('pink-ish', [(window.innerWidth / 10) * 6, window.innerHeight / 8 * 3])
    getButton('purple-ish', [(window.innerWidth / 10) * 2, window.innerHeight / 8 * 4])
    getButton('brown-ish', [(window.innerWidth / 10) * 6, window.innerHeight / 8 * 4])
    getButton('grey-ish', [(window.innerWidth / 10) * 2, window.innerHeight / 8 * 5])
    getButton('skip', [(window.innerWidth / 10) * 6, window.innerHeight / 8 * 5])
    pickColor()
}

function sendData() {
    if (this.elt.value === 'skip') {
        console.log('Data Skipped')
        pickColor()
        redraw()
        return;
    } else {
        const finished = (err) => {
            if (err) {
                console.log('shit, something went wrong')
            } else {
                console.log('Data saved successfully')
                pickColor()
                redraw()
            }
        }
        tone = dbFire.ref('tone')
        data = {
            r,
            g,
            b,
            label: this.elt.value,
            uuid: userId
        }
        color = write ? tone.push(data, finished) : { key: 'No access to database permited.' }
        console.log('Saving Data...')
        console.log('Firebase generated key: - ' + color.key)
        console.log('By user: - ', (write ? userId : color.key))
    }

}

function getButton(label, pos) {
    button = createButton(label)
    button.position(pos[0], pos[1])
    button.mouseReleased(sendData)
    button.elt.value = button.elt.innerHTML;
    button.elt.innerHTML = `<span class="sample ${label}"></span>` + button.elt.innerHTML;
}

function pickColor() {
    r = floor(random(256))
    g = floor(random(256))
    b = floor(random(256))
    background(r, g, b)
}

//https://www.youtube.com/watch?v=Xrhrn8HaFPI&ab_channel=TheCodingTrain

//https://www.youtube.com/watch?v=Xrhrn8HaFPI&t=7s&ab_channel=TheCodingTrain