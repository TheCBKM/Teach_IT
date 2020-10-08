import React, { useState, useEffect } from 'react'
import Reatime from './Realtime'
import './App.less';
import Scrap from './Scrap';
import { PageHeader, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { CheckOutlined } from '@ant-design/icons';
import { Link, Router } from "@reach/router";
import GetTour from './GetTour';
import Tour from 'reactour';

export default function App(props) {
    const [modal, setmodal] = useState(false)
    const [isTourOpen, setIsTourOpen] = useState(false);
    const showModal = () => setmodal(true)
    const handleOk = () => setmodal(false)
    const steps = [
        {
            selector: '',
            content: 'Welcome to the tour !!',
        },
        {
            selector: '#webcam',
            content: 'This is where your will see your self ',

        },
        {
            selector: '#output',
            content: 'Here you will see prediction output',
        },
        {
            selector: '#controllpannel',
            content: 'Here is your Controll Pannel you can add classes, predict, download and upload model with .cbkm extensions'
        },
        {
            selector: '#camswitch',
            content: 'Here You can switch On & Off your camera  '
        },
        {
            selector: '#ClassSamplePannel',
            content: 'Here is your Class Sample Pannel you can add samples images click on Collect Sample'
        },
        {
            selector: '#pnt',
            content: "You would love to see our Privacy & Terms "
        },

    ];
    return (
        <div>
            <PageHeader
                title={<Link to="/"><div style={{ color: "#1967D2" }}>Teach_IT</div></Link>}
                style={{
                    border: "1px solid rgb(235, 237, 240)",
                    borderColor: "#1967D2"
                }}
                extra={
                    <>
                        <Button type="primary" onClick={() => { console.log("wow"); setIsTourOpen(true) }} >Get a Guide</Button>

                        <Link id="scrape" to="/scrape">Scrape_IT</Link>
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
                onOk={handleOk}
                onCancel={handleOk}
                footer={[
                    <Button key="submit" type="primary" onClick={handleOk}>
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
            />
        </div>
    )
}
