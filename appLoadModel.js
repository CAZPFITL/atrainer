let data,
    input,
    img,
    labelList,
    model,
    xs,
    labelsTensor,
    ys,
    _epochs_,
    sliderR,
    sliderG,
    sliderB,
    canvas,
    labelP,
    outputMessage,
    outputLoss,
    totalTensors

const initiateVariables = () => {
    _epochs_ = 60
    labelList = [
        'red-ish',
        'green-ish',
        'blue-ish',
        'orange-ish',
        'yellow-ish',
        'pink-ish',
        'purple-ish',
        'brown-ish',
        'grey-ish',
    ]
}

function setup() {
    initiateVariables()
    loadLoader()
}

const loadLoader = () => {
    createP('label: ')
    labelP = createP('')
    sliderR = createSlider(0, 255, 30)
    createElement('br')
    sliderG = createSlider(0, 255, 255)
    createElement('br')
    sliderB = createSlider(0, 255, 240)
    createElement('br')
    outputMessage = createP('')
    outputLoss = createP('')
    totalTensors = createP('')
    loadJSON('colorData.json', handleLoad)
}

const handleLoad = (json) => {
    data = json
    process()
}

const loadModel = async () => model = await tf.loadLayersModel('/atrainer/my-model.json')

const process = () => {
    createTensor();
    (async () => {
        await loadModel()
        console.log('model trained loaded')
    })();
}

const createTensor = () => {
    /**
     * Architecture
     */
    let colors = [];
    let labels = [];

    for (let record of data.entries) {
        let col = [record.r / 255, record.g / 255, record.b / 255]
        colors.push(col)
        labels.push(labelList.indexOf(record.label))
    }
    /**
     * Tensor
     */
    xs = tf.tensor2d(colors)

    labelsTensor = tf.tensor1d(labels, 'int32')
    // labelsTensor.print()

    ys = tf.oneHot(labelsTensor, 9)
    labelsTensor.dispose()

    // console.log(xs.shape)
    // console.log(ys.shape)
    //xs.print()
    //ys.print()
}

function draw() {
    let r = sliderR.value()
    let g = sliderG.value()
    let b = sliderB.value()
    background(r, g, b)

    tf.tidy(() => {
        const xs = tf.tensor2d([
            [r / 255, g / 255, b / 255]
        ]);

        if (model) {
            let results = model.predict(xs)
            let index = results.argMax(1).dataSync()[0]
            labelP.html(labelList[index])
            totalTensors.html(`tensors created: ${tf.memory().numTensors}`)
        }
    })
}