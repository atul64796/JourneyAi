import React from 'react'

function Login() {
  return (
    <>
  
      <div className=' flex justify-center items-center h-[100vh]  '>
      <form className='flex flex-col gap-6  justify-center p-9 border-radius rounded-md  bg-[#00B7B5] w-[29vw] shadow-md shadow-gray-500' >
      <div className='flex justify-center text-4xl text-yellow-400 '><h1>Login</h1></div>
        <input type='text' name='username' placeholder='Enter your user name' className='border border-gray-600/65 p-3 border-radius rounded-md '/>
        <input type='email' name='email' placeholder='Enter your email' className='border border-gray-600/65 p-3 border-radius rounded-md'/>
        <input type='email' name='password' placeholder='Enter your password' className='border border-gray-600/65 p-3 border-radius rounded-md'/>
        <input type='submit' value="Login" className='border bg-yellow-400 text-black border-gray-600/65 p-2 border-radius rounded-md' />
      </form>
      </div>
    </>
  )
}

export default Login