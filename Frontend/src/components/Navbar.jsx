import React from 'react'
import { NavLink } from 'react-router-dom'
function Navbar() {
  return (
    <>
    <div>
    <ul className='bg-[#234C6A] p-3 flex '>
        <div className='w-[80%]'><span className='font-bold text-3xl text-[#FFC50F] tracking-wide px-3 '>Journey Ai</span></div>
        <div className='flex justify-center gap-10 tracking-wide text-xl text-white items-center'>
        <NavLink to='/' className='text-white hover:text-yellow-400 transition ease-in-out'>Home</NavLink>
        <NavLink to='/register'  className='text-white hover:text-yellow-400 transition ease-in-out'>Register</NavLink>
        <NavLink to='/login'  className='text-white hover:text-yellow-400 transition ease-in-out'>Login</NavLink>
        </div>
    </ul>
    </div>
    </>
  )
}

export default Navbar