let data, input, img, labelList, model, xs, labelsTensor, ys, _epochs_

const initiateVariables = () => {
    _epochs_ = 30
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
    input = createFileInput(handleFile);
    input.position(0, 0);
}

const handleFile = (file) => {
    data = file.data;
    createTensor()
    createModel()
    optCompModel()
    trainModel().then(results => {
        console.log(results)
        console.log(results.history.loss)
    })
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
    // xs.print()
    // ys.print()
}

const createModel = () => {
    /**
     * Model
     */
    model = tf.sequential()
    let hidden = tf.layers.dense({
        units: 9,
        activation: 'sigmoid',
        inputDim: 3
    })

    let output = tf.layers.dense({
        units: 9,
        activation: 'softmax'
    })

    model.add(hidden)
    model.add(output)
}

const optCompModel = () => {
    const lr = 0.2;
    const optimizer = tf.train.sgd(lr)

    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy'
    })
}

const trainModel = async () => {
    const options = {
        epochs: _epochs_,
        validationSplit: 0.1,
        shuffle: true,
        callbacks: {
            onTrainBegin: () => console.log('training model please wait...'),
            onTrainEnd: () => console.log('training completed'),
            onBatchEnd: async(num, logs) => {
                await tf.nextFrame()
            },
            onEpochEnd: (num, logs) => {
                console.log(`Epoch: ${num} \n Loss: ${logs.loss}`)
            }
            //onEpochStart: (num, log) => console.log('Epoch start'),
        }
    }

    return await model.fit(xs, ys, options)
}

function draw() {

}