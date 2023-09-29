import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div className='text-light bg-dark py-3 px-5'>
      <div className='d-flex justify-content-center align-items-center'>
        <center>This is the footer part for every page</center>
        <a herf="#top"><button className='mx-3 btn text-light'>Back to Top</button></a>
      </div>
    </div>
  )
}

export default Footer