import React, { useState } from 'react'
import Tour from 'reactour'

const steps = [
    {
        selector: '',
        content: 'Welcome to the tour',
    },
    {
        selector: '#scrape',
        content: 'Yes you  can scrape too',
    },
];

export default function GetTour(props) {
    const [isTourOpen, setIsTourOpen] = useState(props.istour);

    return (
        <div>
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}
            />
        </div>
    )
}
