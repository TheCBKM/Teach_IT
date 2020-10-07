import React, { useState, useEffect } from 'react'
import Reatime from './Realtime'
import './App.less';
import Scrap from './Scrap';
import { PageHeader, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import {
    CheckOutlined
} from '@ant-design/icons';

import { Link, Router } from "@reach/router";

export default function App() {
    const [modal, setmodal] = useState(false)
    const showModal = () => setmodal(true)
    const handleOk = () => setmodal(false)
    return (
        <div>
            <PageHeader
                title={<div style={{ color: "#1967D2" }}>Teach_IT</div>}
                style={{
                    border: "1px solid rgb(235, 237, 240)",
                    borderColor: "#1967D2"
                }}
                extra={
                    <>
                        <Link to="/scrape">Scrape_IT</Link>
                        <Button type="primary" onClick={showModal}>
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
        </div>
    )
}
