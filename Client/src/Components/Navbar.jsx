import React from 'react'
import { useNavigate } from "react-router-dom";
import '../Css/Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
        <div className='Navbar'>
        <nav>
            <h1>LuxeStay</h1>
           <button onClick={() => navigate("/add")}>
   + Add 
</button>
        </nav>
        </div>
    </div>
  )
}

export default Navbar