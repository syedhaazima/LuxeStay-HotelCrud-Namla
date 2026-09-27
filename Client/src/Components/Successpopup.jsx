import React from 'react'
import "../Css/Successpopup.css";

const Successpopup = ({message}) => {
  return (
    <div className='success-popup'>
        <p>{message}</p>
    </div>
  )
}

export default Successpopup