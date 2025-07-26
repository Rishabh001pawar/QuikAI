import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setLoading(true);
      console.log('Fetching creations from:', '/api/ai/published-creations');
      
      const { data } = await axios.get('/api/ai/published-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      
      console.log('Response data:', data);
      
      if (data.success) {
        setCreations(data.creations);
        console.log('Creations loaded:', data.creations.length);
      } else {
        console.error('API returned success: false', data);
        toast.error(data.message || "Failed to fetch creations");
      }
    } catch (error) {
      console.error('Fetch creations error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 404) {
          toast.error("API endpoint not found. Please check your backend routes.");
        } else if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else {
          toast.error(message || `Server error (${status}). Please try again.`);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800'>Community Creations</h1>
        {loading && (
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
        )}
      </div>
      
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll p-4'>
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <p className='ml-3 text-gray-600'>Loading creations...</p>
          </div>
        ) : creations.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
            <p className='text-lg'>No creations found</p>
            <p className='text-sm'>Be the first to share your creation!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {creations.map((creation, index) => (
              <div key={creation.id || index} className='relative group bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                <div className='aspect-square'>
                  <img 
                    src={creation.content} 
                    alt={creation.prompt || "AI Generated Content"}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                      console.error('Failed to load image:', creation.content);
                    }}
                  />
                </div>
                
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                  <p className='text-white text-sm mb-2 line-clamp-2'>
                    {creation.prompt || "No description available"}
                  </p>
                  
                  <div className='flex items-center justify-between'>
                    <span className='text-white text-xs'>
                      AI Generated
                    </span>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Community;