const featureExtractor = ml5.featureExtractor("MobileNet", () => console.log("Model Loaded!!"));
const classifier = featureExtractor.classification(() => console.log("The video is ready!"));


export const addImage = (img, tag) => new Promise((resolve, reject) => resolve(classifier.addImage(img, tag)));

export const train = () => {
    console.log("train")

    return new Promise((resolve, reject) => {
        let value = []
        classifier.train(function(lossValue) {
            value.push(lossValue)
            console.log("Loss is", lossValue);
        }).then(() => resolve(value))
    })
}
export const classify = (img) => {
    return new Promise((resolve, reject) => {
        console.log("classify")
        classifier.classify(img, function(err, result) {
            console.log(result);
            resolve(result)
        });
    })
}

export const createImg = (imglink) => {
    let img = document.createElement('img')
    img.width = 224
    img.height = 224
    img.src = imglink
    return img
}