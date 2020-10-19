import React, { useState, useEffect } from 'react'
import { Button, Card, Input, message, Switch } from 'antd';
import { startApp, addImg, predictImg, getExampleCount, downloadObjectAsJson, load } from './ml'
import {
    CloudDownloadOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Speech from 'speak-tts' // es6
const speech = new Speech() // will throw an exception if not browser supported
if (speech.hasBrowserSupport()) { // returns a boolean
    console.log("speech synthesis supported")
}
speech.init({
    'lang': 'hi-IN',
}).then((data) => {
    // The "data" object contains the list of available voices and the voice synthesis params
    console.log("Speech is ready, voices are available", data)
    speech.speak({
        text: "Welcome to the teach it . I am your assistant ojl",
    })
}).catch(e => {
    console.error("An error occured while initializing : ", e)
})


export default function Reatime() {
    let webcamElement
    const [classes, setclasses] = useState([{ name: 'Me', count: 0, id: 0 }, { name: 'Another Me ', count: 0, id: 1 }])
    const [output, setoutput] = useState("Add Samples to Predict")
    const [dissable, setdissable] = useState(true)
    const [webcam, setwebcam] = useState(undefined)
    const [dataURL, setdataURL] = useState('')
    useEffect(() => {
        (async () => {
            webcamElement = document.getElementById("webcam");
            let webcam = await tf.data.webcam(webcamElement);

            setwebcam(webcam)
            setdissable(false)
            console.log("webcam", webcam)
            message.success(`Camera is ON`);

        })()
    }, [webcamElement])

    useEffect(() => {
        message.success(`Allow Camera Permissions`);

        exampleCount()
        startApp()
    }, [])

    useEffect(() => {

        const interval = setInterval(() => {
            predi()
        }, 1000);
        return () => clearInterval(interval);
    });

    const addClass = () => {
        setclasses([{ name: "Edit this Class", count: 0, id: classes.length }, ...classes])
    }

    const exampleCount = () => {
        let x = getExampleCount()
        let m = classes
        for (let i = 0; i < m.length; i++) {
            m[i].count = x[m[i].id] || 0
        }
        setclasses([...m])
    }


    const collectSamples = async (id) => {
        addImg(await webcam.capture(), id)
        exampleCount()
    }


    const ChangeClassName = (e, id) => {
        let m = classes
        console.log(m.length)
        for (let i = 0; i < m.length; i++) {
            if (m[i].id == id) {
                console.log(e.target.value)

                m[i].name = e.target.value
                break;
            }
        }

        setclasses([...m])

    }



    const predi = async () => {
        if (!webcam) {
            console.log("Loading....")
            return
        }
        let img = await webcam.capture();
        predictImg(img)
            .then((res) => {
                console.log(res)
                let result = res.result
                if (res.success) {
                    let m = classes
                    let lable = Number(res.result.label) || 0
                    console.log(lable)

                    for (let i = 0; i < m.length; i++) {
                        if (m[i].id == lable) {
                            console.log('set lable', m[i].name)
                            if (output != m[i].name)
                                speech.speak({
                                    text: m[i].name,
                                })
                            setoutput(m[i].name)
                            break
                        }
                    }
                }
            })
            .catch(console.log);
        img.dispose();
        await tf.nextFrame();
    }
    const handleFileSelect = (evt) => {
        var files = evt.target.files; // FileList object

        // use the 1st file from the list
        let f = files[0];

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                console.log(e.target.result);
                let str = e.target.result;
                console.log(str)
                let clasNames = load(str)
                console.log(getExampleCount())
                var m = getExampleCount()
                var newClasses = []
                var keys = Object.keys(m)
                for (let i = 0; i < keys.length; i++) {
                    newClasses.push({ name: clasNames[keys[i]], count: m[keys[i]], id: keys[i] })
                }
                console.log(newClasses)
                setclasses([...newClasses])
                message.success(`Model Loaded Successfully.`);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }
    const toggleCam = (evt) => {
        console.log(evt)
        if (evt) {
            webcam.start()
            setdissable(false)
            message.success(`Camera is ON`);


        }
        else {
            const video = document.getElementById("webcam");

            const canvas = document.createElement("canvas");
            // scale the canvas accordingly
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // draw the video at that frame
            canvas.getContext('2d')
                .drawImage(video, 0, 0, canvas.width, canvas.height);
            // convert it to a usable data URL
            const dataURL = canvas.toDataURL();
            setdataURL(dataURL)
            console.log(dataURL)
            webcam.stop()
            setdissable(true)
            message.success(`Camera is OFF`);


        }

    }

    // setInterval(predi, 1000)
    const cardStyle = {
        borderColor: "#1967D2"
    };
    return (
        <div>
            <center>
                <p>
                    <Card title="Web-Cam Output" extra={<Switch id="camswitch" defaultChecked onChange={toggleCam} />} className="myCard" style={cardStyle}>
                        {dissable &&
                            <img src={dataURL} style={{
                                filter: 'grayscale(100%)'
                            }} />
                        }
                        <video hidden={dissable} playsInline muted id="webcam" width="500" height="300"></video>

                    </Card>
                    <h3>
                        <h2 id="output">  <Text code>{output}</Text>

                        </h2>
                    </h3>
                    <br />
                    <Card id="controllpannel" className="myCard" title="Controll Pannel" style={cardStyle} >

                        <Button disabled={dissable} type="primary" onClick={addClass}><PlusOutlined /> Add Class </Button>&nbsp;
                    <Button type="primary" disabled={dissable} id="predict" onClick={predi}> <SearchOutlined />Predict </Button>&nbsp;

                    <Button type="primary" onClick={() => {
                            downloadObjectAsJson(classes); message.success(`Model ready to Download`);
                        }}> <CloudDownloadOutlined /> Download </Button>&nbsp;

                    <Input type="file" style={{ width: 200 }} onChange={handleFileSelect} />
                    </Card>
                </p>
                <Card id="ClassSamplePannel" className="myCard" title="Class Sample Pannel" style={cardStyle}>

                    {classes.map(c => {
                        return (<p>
                            <Input onChange={(e) => ChangeClassName(e, c.id)} value={c.name} style={{ width: 300 }} size="middle" placeholder="Type Cass Name"></Input>
                    &nbsp;
                            <Button disabled={dissable} onClick={() => collectSamples(c.id)}>Collect Sample</Button>
                    &nbsp;&nbsp;&nbsp;
                            <Button type="dashed" >{c.count}</Button>
                        </p>)
                    })}
                </Card>
            </center>
        </div>
    )


}
