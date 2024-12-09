import React from 'react'
import Vid1 from './assets/vid1.mp4'
const Vid = () => {
  return (
    <>
  
    <video className='relative' autoPlay muted loop>
        <source src={Vid1} />
      
      </video>
    
</>
  )
}

export default Vid