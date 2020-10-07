import React, { useEffect, useState } from 'react'
import axios from 'axios' 
import { Button, Input, Spin } from 'antd'
export default function Scrap() {
    const [result, setresult] = useState([])
    const [query, setquery] = useState('johnny')
    const [loading, setloading] = useState(false)
    const [count, setcount] = useState(20)
    const scrapeName = (e) => {
        setquery(e.target.value)
    }
    const countvalue = (e) => {
        setcount(e.target.value)
    }

    const scrape = () => {
        setresult([])
        setloading(true)
        if (query.includes('johnny'))
            axios.get(`https://scrape-it-cbkm.herokuapp.com/get/${Number(count) || 20}/johnny sins`)
                .then((res) => {
                    console.log(res.data)
                    setresult(res.data)
                    setloading(false)

                })
                .cath(console.log)
        else
            axios.get(`https://scrape-it-cbkm.herokuapp.com/get/${Number(count) || 20}/${query}`)
                .then((res) => {
                    console.log(res.data)
                    setresult(res.data)
                    setloading(false)

                })
                .cath(console.log)
    }
    return (
        <div>
            <center>
                <p>
                    <Input onChange={scrapeName} value={query} style={{ width: 300 }} ></Input>
                    <Input onChange={countvalue} value={count} style={{ width: 50 }} ></Input>

                    <Button onClick={scrape}>Scrape</Button>
                </p>
                {loading && <Spin />}
                {result.length > 0 && <p>
                    Scrapped {result.length} images from google for keyword {query}
                </p>}
                {result.map(r => <img width="200" src={r.url}></img>)}
            </center>

        </div>
    )
}
