import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'


const Home = () => {
  return (
    <>
     <Navbar/>
     <Hero/>
     <AiTools/>
     <Testimonial/>
     <Plan/>
     <Footer/>
    </>
  )
}

export default Home



{/* <div className="container mx-auto px-4">
         <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
           Welcome to QuikAI
         </h1>
         <p className="text-xl text-center text-gray-600">
           Your AI-powered productivity assistant
         </p>
       </div> */}