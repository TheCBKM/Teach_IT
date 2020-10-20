import React, { useState, useEffect } from 'react'
import Reatime from './Realtime'
import './App.less';
import Scrap from './Scrap';
import { PageHeader, Button ,message} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { CheckOutlined } from '@ant-design/icons';
import { Link, Router } from "@reach/router";
import {
    BrowserView,
    MobileView,
  } from "react-device-detect";
import Tour from 'reactour';
import copy from 'copy-to-clipboard';

export default function App(props) {
    const [modal, setmodal] = useState(false)
    const [isTourOpen, setIsTourOpen] = useState(false);
    const showModal = () => setmodal(true)
    const handleOk = () => setmodal(false)
    const guideAvatar='assistant.png'
    const steps = [
        {
            selector: '',
            content: () => (
                <div>
                    <img height="200" src={guideAvatar} alt="" /><br /> Welcome I'm your personal bot Ojal !! <br /> I will guide you !!
                </div>
            ),
        },
        {
            selector: '#webcam',
            content: () => (
                <div>
                    <img height="50" src={guideAvatar} alt="" />
                    <br />This is where your will see your self
                </div>
            ),

        },
        {
            selector: '#output',
            content: () => (
                <div>
                    <img height="50" src={guideAvatar} alt="" />
                    <br />Here you will see prediction output
                </div>
            ),
        },
        {
            selector: '#controllpannel',
            content: () => (
                <div>
                    <img height="50" src={guideAvatar} alt="" />
                    <br />Here is your Controll Pannel you can add classes, predict, download and upload model with .cbkm extensions
                </div>
            ),
        },
        {
            selector: '#camswitch',
            content: () => (
                <div>
                    <img height="50" src={guideAvatar} alt="" />
                    <br />Here You can switch On & Off your camera  
                </div>
            ),
        },
        {
            selector: '#ClassSamplePannel',
            content: () => (
                <div>
                    <img height="50" src={guideAvatar} alt="" />
                    <br />Here is your Class Sample Pannel you can add samples images , click on Collect Sample 
                </div>
            ),
        },
        {
            selector: '#pnt',
            content: () => (
                <div>
                    <img height="50" src={guideAvatar} alt="" />
                    <br />You would love to see our Privacy & Terms 
                </div>
            ),
        },

    ];
    return (
        <div>
<BrowserView>

            <PageHeader
                title={<Link to="/"><div style={{ color: "#1967D2" }}>Teach_IT</div></Link>}
                style={{
                    border: "1px solid rgb(235, 237, 240)",
                    borderColor: "#1967D2"
                }}
                extra={
                    <>
                    <Button id="pnt" type="primary" onClick={()=>{
                        copy(code)
                        message.success(` Code Snippets coppied !!`);
                        message.success(` Paste it on index.html`);
                        }}>
                        Code Snippets    </Button>
                        <Button type="primary" onClick={() => { console.log("wow"); setIsTourOpen(true) }} >Get a Guide</Button>

                        {/* <Link id="scrape" to="/scrape">Scrape_IT</Link> */}
                        <Button id="pnt" type="primary" onClick={showModal}>
                            Privacy & Terms</Button>
                    </>}
            />,
            <Router>

                <>
                    <Reatime default path="/" />
                    <Scrap path="/scrape" />
                </>

            </Router>

            <Modal
                title=" Privacy & Terms"
                visible={modal}
                onOk={() => setmodal(false)}
                onCancel={() => setmodal(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={() => setmodal(false)}>
                        Agree
          </Button>,
                ]}
            >
                <p><CheckOutlined /> We didn't Collect your Dataset in any form (data-points/images/trained model/etc.) </p>
                <p><CheckOutlined /> We didn't Train the Model on our servers Everything runs on the browsers itself.</p>
                <p><CheckOutlined /> We didn't send data to a third party (only dependent party and API may collect.</p>
                <p><CheckOutlined /> We can have data points anonymously for analytics only.</p>
            </Modal>
           
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}
                closeWithMask={false}
                rounded={10}
            >
            </Tour>
            </BrowserView>

            <MobileView>
                
                <center >
    <h2> We don't support <b> Mobile View </b><br/> For better user experience use your Desktop with camera and speakers  <br/> (Google chrome is recomended)   </h2>
    <h3>- CBKM</h3>
                </center>
    </MobileView>
        </div>
    )
}


const code =`<!DOCTYPE html>
<html lang="en">

<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier"></script>
    <meta charset="utf-8" />
    <title>Teach-IT Implementation </title>
</head>

<body>
    <center>
        <video autoplay playsinline muted id="webcam" width="500" height="500"></video>
        <h1 style="padding: 100px;" id="console">LOADING....</h1>
    </center>
    <script>
        let modelURL = 'model.cbkm'
    </script>
    <script src="https://teach-it.cbkm.in/sample.js"></script>
</body>

</html>`
