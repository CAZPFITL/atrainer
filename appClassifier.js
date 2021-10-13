let data, input, img

function setup() {
    loadLoader()
}

const loadLoader = () => {
    input = createFileInput(handleFile);
    input.position(0, 0);
}

const handleFile = (file) => {
    data = file.data;
    createTensor()
}

const createTensor = () => {
    let colors = [];
    for (let record of data.entries) {
        let col = [record.r / 255, record.g / 255, record.b / 255]
        colors.push(col)
    }
    let xs = tf.tensor2d(colors)
    console.log(xs)
}