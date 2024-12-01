import React from 'react'
import './VideoCards.css'

function VideoCards({ video }) {
    return (
        <>
            <div className='card-video-data'>
                <iframe src={video.url} title='video-movie'/>
                <span className='video-name-card'>{video.name}</span>
            </div>
        </>
    )
}

export default VideoCards