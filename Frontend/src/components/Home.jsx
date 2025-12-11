import React from 'react'

function Home() {
  return (
    <>
        <div className='flex flex-col gap-10 justify-center h-[100vh] items-center'>
            <h1 className='text-7xl'>welcome To Home Page</h1>
            <div className='buttons flex justify-between gap-4'>
            <button className=' bg-[#0aff6c]  p-2 px-6  border-2 border-radius rounded-sm text-xl text-black '>Login</button>
            <button className=' bg-[#234C6A] p-2 px-6  border-2 border-black  border-radius rounded-sm text-xl text-white'>Signup</button>
            </div>
        </div>
    </>
  )
}

export default Home