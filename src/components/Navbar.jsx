import React from 'react'
import '../components/Navbar.css'
import spotifyLogo from '../assets/spotifyPNG.png'

const Navbar = () => {
  return (
    <div className='landing__header'>
        <img src={spotifyLogo} alt="" />
        <p>Created with Spotify's API</p>
    </div>
  )
}

export default Navbar