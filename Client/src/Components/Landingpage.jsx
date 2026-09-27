import React from 'react'
import { Helmet } from "react-helmet-async";
import '../Css/Landingpage.css'
import SearchFilter from './Searchfilter'

const Landingpage = ({search,setSearch, minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice}) => {
  return (
    <div>
          <Helmet>
      <title>LuxeStay - Find Your Stay</title>
      <meta
        name="description"
        content="Find and manage your perfect hotel stay with LuxeStay."
      />
    </Helmet>
        <div className='Landingpage'>
        <p>Find Your Stay</p>
        <h2> Find. Stay. Experience </h2>
     
        <SearchFilter
  search={search}
  setSearch={setSearch}
  minPrice={minPrice}
  setMinPrice={setMinPrice}
  maxPrice={maxPrice}
  setMaxPrice={setMaxPrice}
/>
        </div>
    </div>
  )
}

export default Landingpage