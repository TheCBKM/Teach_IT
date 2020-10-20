let model
const classifier = knnClassifier.create();
let net;
let classes
const webcamElement = document.getElementById("webcam");


function preload() {
    model = loadStrings(modelURL)
}
async function setup() {
    startApp()
    classes = load(model)
    app()
}
async function app() {
    webcam = await tf.data.webcam(webcamElement);
}

async function predictImg(img) {
    return new Promise(async(resolve, reject) => {
        if (classifier.getNumClasses() > 0) {
            const activation = net.infer(img, "conv_preds");
            const result = await classifier.predictClass(activation);
            resolve({
                success: true,
                result
            });
        } else reject({
            success: false,
            result: "no classifier"
        })
    })
}

function load(dataset) {
    if (!dataset) {
        dataset = localStorage.getItem("myData");
    }
    let classNames = {}
    classifier.setClassifierDataset(
        Object.fromEntries(
            JSON.parse(dataset).map(([label, data, shape, cn]) => {
                classNames[label] = cn
                return [
                    label,
                    tf.tensor(data, shape),
                ]
            })
        )
    );

    return classNames
}

async function startApp() {
    console.log("Loading mobilenet..");
    net = await mobilenet.load();
    console.log("Successfully loaded model");
}


async function draw() {
    let img = await webcam.capture();
    predictImg(img)
        .then((res) => {
            console.log(res)
            let result = res.result
            if (res.success) {
                let m = classes
                let lable = Number(res.result.label) || 0
                console.log(lable)
                document.getElementById('console').innerHTML = classes[lable]
            }
        })
        .catch(console.log);
    img.dispose();
    await tf.nextFrame();
}