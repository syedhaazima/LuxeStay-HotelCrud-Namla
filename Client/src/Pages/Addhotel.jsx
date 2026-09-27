import React from 'react'
import Hotelform from '../Components/Hotelform'

const Addhotel = ({ setRefresh }) => {
  return (
    <div>
        <Hotelform mode="add" setRefresh={setRefresh}/>
    </div>
  )
}

export default Addhotel