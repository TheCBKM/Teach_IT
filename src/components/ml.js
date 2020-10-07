const classifier = knnClassifier.create();
let net;

export async function startApp() {
    console.log("Loading mobilenet..");
    net = await mobilenet.load();
    console.log("Successfully loaded model");
}

export function getExampleCount() { return classifier.getClassExampleCount() }

export function addImg(img, classId) {
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
}

export async function predictImg(img) {
    return new Promise(async(resolve, reject) => {
        if (classifier.getNumClasses() > 0) {
            const activation = net.infer(img, "conv_preds");
            const result = await classifier.predictClass(activation);
            resolve({ success: true, result });
        } else reject({ success: false, result: "no classifier" })
    })
}


export function saveLocal() {
    localStorage.setItem(
        "myData",
        JSON.stringify(
            Object.entries(classifier.getClassifierDataset()).map(([label, data]) => [
                label,
                Array.from(data.dataSync()),
                data.shape,
            ])
        )
    );
    console.log("Saved");
}


export function downloadObjectAsJson(classes) {
    console.log(classes)
    if (classifier.getNumClasses() <= 0) return
    var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(
            JSON.stringify(
                Object.entries(
                    classifier.getClassifierDataset()
                ).map(([label, data]) => [
                    label,
                    Array.from(data.dataSync()),
                    data.shape,
                    classes.find((c) => Number(c.id) == Number(label)).name,
                ])
            )
        );
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "model" + ".cbkm");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


export function load(dataset) {
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
    console.log(classNames)
    console.log("loaded");
    return classNames
}