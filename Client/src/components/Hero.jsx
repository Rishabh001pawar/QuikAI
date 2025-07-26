import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

    const navigate=useNavigate();


  return (
    <div 
      className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-cover bg-no-repeat min-h-screen'
      style={{ backgroundImage: `url(${assets.gradientBackground})` }}>
    
        <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold max-auto leading-[1.2]">
           Welcome to <span className="text-primary">Quick.ai</span>
         </h1>
         <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600">
          Transforming your ideas into reality with AI-powered tools
         </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
            <button onClick={() => navigate('/ai')} className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer">Start creating now</button>
            
        </div>

        <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
            <img src={assets.user_group} alt="" className='h-8'/>trusted by 1000+ users
        </div>    
    </div>
  )
}

export default Hero
