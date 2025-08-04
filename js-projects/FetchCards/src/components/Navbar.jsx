import React from 'react'
import home from '../assets/home.svg'
import about from '../assets/about.svg'
import contact from '../assets/contact.svg'

const Navbar = (props) => {
  return (
      <nav className='flex bg-gray-700 justify-between p-5 pl-10 pr-10 text-white text-[18px] items-center'>
        <div className="logo flex gap-2.5 items-center">
            <img src={props.logoSrc} className='w-10' alt="." />
            <span className='tracking-[6px] Cfont'>{props.name}</span>
        </div>
        <ul className='flex gap-6.5'>
            <li className='flex items-center gap-2'><img src={home} alt="Home" className='w-6'/><span className='hidden sm:inline'>Home</span></li>
            <li className='flex items-center gap-2'><img src={about} alt="About us" className='w-6'/><span className='hidden sm:inline'>About us</span></li>
            <li className='flex items-center gap-2'><img src={contact} alt="Contact us" className='w-6'/><span className='hidden sm:inline'>Contact us</span></li>
        </ul>
    </nav>
  )
}

export default Navbar