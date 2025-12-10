import React from 'react'

function Register() {
  return (
    <>
      {/* //username, fullName, email, password  */}
      <div className=' flex justify-center items-center h-[100vh] '>
      <form className='flex flex-col gap-6  justify-center p-9 border-radius rounded-md  bg-[#00B7B5] shadow-md shadow-gray-500 w-[35vw]' action="/upload" enctype="multipart/form-data" >
      <div className='flex justify-center text-4xl text-yellow-400 '><h1>Signup</h1></div>
        <input type='text' name='username' placeholder='Enter your user name' className='border border-gray-600/65 p-3 border-radius rounded-md '/>
        <input type='text' name='fullName' placeholder='Enter your full name' className='border border-gray-600/65 p-3 border-radius rounded-md'/>
        <input type='email' name='email' placeholder='Enter your email' className='border border-gray-600/65 p-3 border-radius rounded-md'/>
        
        <input type='password' name='password' placeholder='Enter your password' className='border border-gray-600/65 p-3 border-radius rounded-md'/>
        <div className='flex p-2'> 
        <input type='file' name='avatar' className=' w-1/2'  />
        <input type='file' name='coverImage' className=' w-1/2'/>
        </div>
       
        <input type='submit' value="Signup" className='border bg-yellow-400 text-black border-gray-600/65 p-2 border-radius rounded-md' />
      </form>
      </div>
    </>
  )
}

export default Register