import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const AiTools = () => {
    const navigate = useNavigate();
   return (
    <div className='px-4 sm:px-20 xl:px-32 my-24 bg-white'>
        <div className='text-center' >
            <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI tools</h2>
            <p className='text-gray-700 max-w-lg mx-auto' >Everything you need to create, enhance and optimize amazing AI-powered applications</p>
            {/* <p className='text-red-500 font-bold'>AiTools Component is rendering! Data length: {AiToolsData?.length || 0}</p> */}
        </div>

        <div className='flex flex-wrap mt-10 justify-center'>
            {AiToolsData.map((tools, index) => (
                <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer' onClick={() => {
                    navigate(tools.path);
                }}>
                    <tools.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{ background: `linear-gradient(to bottom, ${tools.bg.from},${tools.bg.to})` }} />
                    <h3 className='mt-6 mb-3 text-lg font-semibold'>{tools.title}</h3>
                    <p className='text-gray-600 text-sm max-w-[95%]'>{tools.description}</p>

                </div>
            ))}
        </div>
      
    </div>
    
  )
}

export default AiTools
