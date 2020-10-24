import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Input, message, Row, Switch } from 'antd';
import { startApp, addImg, predictImg, getExampleCount, downloadObjectAsJson, load, clearClass } from './ml'
import {
    CloudDownloadOutlined,
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined
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
        message.success("New Class Added")
    }

    const deleteClass = (id) => {
        let temp = classes
        let tid = undefined
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id == id) {
                tid = i
                break
            }
        }

        if (tid != undefined) {
            console.log(temp, tid)
            console.log("Inside if")
            temp.splice(tid, 1)
            console.log(clearClass(id))
            message.error("Class Deleted")
        }
        setclasses([...temp])
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

            <p>
                <Row gutter={8} justify="space-around" align="top" >
                    <Col sm={12} >
                        <Card title="Web-Cam Output" extra={<Switch id="camswitch" defaultChecked onChange={toggleCam} />} className="myCard" style={{
                            width: "100%",
                            ...cardStyle,
                            textAlign: "center",
                        }}>
                            {dissable &&
                                <img width="80%" height="50%" src={dataURL} style={{
                                    filter: 'grayscale(100%)'
                                }} />
                            }
                            <video hidden={dissable} playsInline muted id="webcam" width="80%" height="50%"></video>

                            <h3>
                                <h2 id="output">  <Text code>{output}</Text>

                                </h2>
                            </h3>
                        </Card>
                    </Col>
                    <Col sm={12}>

                        <Card id="ClassSamplePannel" className="myCard" title="Class Sample Pannel" style={{ width: "100%", ...cardStyle, textAlign: "center", }}>

                            {classes.length < 1 ? "Add Some classes or import your model" : classes.map(c => {
                                return (<p>
                                    <Row justify="center" align="top" gutter={5}>
                                        <Col lg={8} >
                                            <Input onChange={(e) => ChangeClassName(e, c.id)} value={c.name} size="middle" placeholder="Type Cass Name"></Input>
                                        </Col>
                                        <Col lg={8}>
                                            <Button type="primary" disabled={dissable} style={{ width: "80%" }} s onClick={() => collectSamples(c.id)}>Collect Sample</Button>
                                        </Col> <Col lg={2}>
                                            <Button type="text"   >{c.count}</Button>
                                        </Col>
                                        <Col lg={2}>
                                            <Button type="text" onClick={() => { deleteClass(c.id) }} ><DeleteOutlined style={{ color: "red" }} /></Button>
                                        </Col>
                                    </Row>
                                </p>)
                            })}
                        </Card>
                    </Col>
                </Row>
                <br />
                <Row align="stretch" justify="center">
                    <Col sm={12}>
                        <Card id="controllpannel" className="myCard" title="Controll Pannel" style={{ width: "100%", ...cardStyle, textAlign: "center", }} >

                            <Button disabled={dissable} type="primary" onClick={addClass}><PlusOutlined /> Add Class </Button>&nbsp;
                    <Button type="primary" disabled={dissable} id="predict" onClick={predi}> <SearchOutlined />Predict </Button>&nbsp;

                    <Button type="primary" onClick={() => {
                                if (Object.keys(getExampleCount()).length) {
                                    downloadObjectAsJson(classes);
                                    message.success(`Model ready to Download`);
                                    return
                                }
                                message.error(`No Model Genrated`);
                                message.error(`Add Samples`);
                            }}> <CloudDownloadOutlined /> Download </Button>&nbsp;


                    <Input type="file" style={{ width: 200 }} onChange={handleFileSelect} />
                        </Card>
                    </Col>
                </Row>            </p>


        </div>
    )


}

