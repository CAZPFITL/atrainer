let r, g, b, W, H, colorByLabel, uid_bycount, users, DownloadData, labelX
var appFire, dbFire, dbReference, errData, data, keys
if (1===1)  {
    return;
}

/**
 * Configuration size
 */
labelX = 'red-ish'
const scale = 30

/**
 * Helpers
 */
const firebaseConfig = {
    apiKey: "AIzaSyALJK23uLX46X1wNR_lDJzdLEahoW7IEtU",
    authDomain: "color-data-a1f4c.firebaseapp.com",
    projectId: "color-data-a1f4c",
    storageBucket: "color-data-a1f4c.appspot.com",
    messagingSenderId: "930703974581",
    appId: "1:930703974581:web:bc1046424d31729f135efc",
    measurementId: "G-1RGVF8Y3ND"
}

const thisHouseIsCleanNow = () => {
    initializeDataSet() // clear data 
    loadDB() // Load Data Again
}

const drawSelect = () => {
    sel = createSelect();
    sel.position(8, (H));
    sel.option('red-ish');
    sel.option('green-ish');
    sel.option('blue-ish');
    sel.option('orange-ish');
    sel.option('yellow-ish');
    sel.option('pink-ish');
    sel.option('purple-ish');
    sel.option('brown-ish');
    sel.option('grey-ish');
    sel.selected(labelX);
    sel.changed((e) => { labelX = e.target.value; thisHouseIsCleanNow(); })
}

const getButton = () => {
    button = createButton('Download Data')
    button.position(120, H)
    button.mouseReleased(() => saveJSON(DownloadData, 'colorData.json'))

}

const getSizes = () => {
    let colorSet = colorByLabel[labelX]
    
    let Width = ((window.innerWidth - scale) - window.innerWidth.toString().slice(-1))
    Width = Math.trunc(Width / scale) * scale

    let Height = (colorSet.length - colorSet.length.toString().slice(-1)) / (Width / scale)
    Height = (round(Height) + 1) * scale
    
    return [Width, Height]
}

const initializeDataSet = () => {
    colorByLabel = {
        'red-ish': [],
        'green-ish': [],
        'blue-ish': [],
        'orange-ish': [],
        'yellow-ish': [],
        'pink-ish': [],
        'purple-ish': [],
        'brown-ish': [],
        'grey-ish': [],
    }
    uid_bycount = {}
    users = []
    DownloadData = {
        entries: []
    }
}

const loadDB = () => {
    //Initialize Firebase
    appFire = appFire ?? firebase.initializeApp(firebaseConfig)
    dbFire = dbFire ?? firebase.database()
    dbReference = dbReference ?? dbFire.ref('tone')
    dbReference.once('value', gotData, errData)
}

const resizeMyCanvas = () => {
    let sizes = getSizes()
    let W = sizes[0]
    let H = sizes[1]
    resizeCanvas(W, H)
}

function setup() {
    noCanvas()
    createCanvas(window.innerWidth * .98, window.innerHeight)
    noStroke()
    thisHouseIsCleanNow()
}

function gotData(response) {
    data = response.val()
    keys = Object.keys(data)

    for (let key of keys) {
        let record = data[key]
        let id = record.uuid
        record.key = key
        colorByLabel[record.label].push(record)
        DownloadData.entries.push(record)

        if (!uid_bycount[id]) {
            uid_bycount[id] = 1
            users.push(id)
        } else {
            uid_bycount[id]++
        }
    }
    clear() //clear canvas
    resizeMyCanvas()
    drawData()
    writeData(keys)
    drawSelect()
    getButton()
}

function mousePressed() {
    let sizes = getSizes()
    let i = floor(mouseX / scale)
    let j = floor(mouseY / scale)
    let index = i + j * (sizes[0] / scale)
    let data = colorByLabel[labelX]
    if (mouseX < sizes[0] && mouseY < sizes[1] && data[index]) {
        if (mouseX < sizes[0] &&     mouseY < sizes[1] && data[index]) {
            if (confirm('Are you sure you want to delete this record from the database?')) {
                let elementToRemove = firebase.database().ref(`tone/${data[index].key}`)

                elementToRemove.remove()
                    .then(function () {
                        console.log('"wrong color" deleted from the database.');
                    })
                    .catch(function (error) {
                        console.log("Remove failed: " + error.message)
                    });

            } else {
                console.log('ok.');
            }
            thisHouseIsCleanNow()
        }
    }
}

function drawData() {
    let colorSet = colorByLabel[labelX]
    let x = 0
    let y = 0
    for (let index = 0; index < colorSet.length; index++) {

        noStroke()
        fill(colorSet[index].r, colorSet[index].g, colorSet[index].b)
        rect(x, y, scale, scale)
        
        x += scale

        if (x >= width) {
            x = 0
            y += scale
        }
    }
}

function writeData(keys) {
    const drawOutter = (htmlOutput) => {
        const dom = document.querySelector('#data')
        if (dom == null) {
            let outTag = document.createElement('div')
            outTag.id = 'data'
            outTag.innerHTML = htmlOutput
            document.querySelector('main').append(outTag)
        } else {
            dom.innerHTML = htmlOutput
        }
    }
    let htmlOutput = 'Data length: <b>' + keys.length + '</b><br>'
    // console.log(colorByLabel)
    // console.log('Data length: ' + keys.length)
    users.sort((b, a) => uid_bycount[a] - uid_bycount[b])
    for (let id of users) {
        // console.log(id + ' ' + uid_bycount[id])
        htmlOutput += id + ' <b>' + uid_bycount[id] + '</b><br>'
    }

    htmlOutput += '</div>';
    drawOutter(htmlOutput);
}