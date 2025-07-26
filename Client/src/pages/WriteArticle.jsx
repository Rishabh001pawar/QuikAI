import { Sparkles, Edit } from 'lucide-react'
import React,{useState} from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
import Markdown from 'react-markdown'



axios.defaults.baseURL = import.meta.env.VITE_BASE_URL 

const WriteArticle = () => {

  const articleLength=[
    {length:800, text:'Short (500-800 words)'},
    {length:1200, text:'Medium (1000 words)'},
    {length:1600, text:'Long (1500+ words)'},
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()


 const onSubmitHandler = async (e) => {
  e.preventDefault()
  try{
    setLoading(true)
    const prompt= `Write a ${selectedLength.text} article on the topic: ${input}`
    const {data} = await axios.post('/api/ai/genrate-article',{prompt,length:selectedLength.length},{
      headers:{
        Authorization: `Bearer ${await getToken()}`
      }
    })
    if(data.success){
      setContent(data.content)
    }else{
      toast.error(data.message)
    }
  }catch (error){
    console.log('API Error:', error.response?.data || error.message)
    toast.error(error.response?.data?.message || "An error occurred while generating the article.")
  }
  setLoading(false)
}

  return (
  <div className='h-full overflow-y-scroll p-6 text-slate-700'>
    <div className='flex flex-col md:flex-row gap-6'>
      {/* LEFT: Article Form */}
      <form onSubmit={onSubmitHandler} className='w-full md:w-1/2 p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-lg font-semibold'>Write Article</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Enter the topic of your article'
          required
        />

        <p className='mt-4 text-sm font-medium'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {
            articleLength.map((item, index) => (
              <span
                onClick={() => setSelectedLength(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`}
                key={index}
              >
                {item.text}
              </span>
            ))
          }
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226bff] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Edit className='w-5' />
          }
          Generate Article
        </button>
      </form>

      {/* RIGHT: Generated Article */}
      <div className='w-full md:w-1/2 p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[300px]'>
        <div className='flex items-center gap-3 mb-4'>
          <Edit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>

        {!content ?(
          <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-3 text-gray-400'>
            <Edit className='w-6 h-9' />
            <p>Article content goes here...</p>
          </div>
        </div>
        ):(
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
          <div className='reset-tw'>  
            <Markdown>{content}</Markdown>       
          </div>
        </div>
        )}        
      </div>
    </div>
  </div>
);

}

export default WriteArticle
