import React from 'react'
import './CastCards.css'

function CastCards({ cast }) {
    return (
        <>
            <div className='card-cast-data'>
                <img src={cast.url} alt='image-cast' />
                <span className='cast-name-card'>{cast.name}</span>
                <hr className='spacing-cast-card'></hr>
                <span className='cast-characterName-card'>{cast.characterName}</span>
            </div>
        </>
    )
}

export default CastCards