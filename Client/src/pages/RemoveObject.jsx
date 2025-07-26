import { Scissors, Sparkles, Eraser, ImageIcon, Download, Copy, Check } from 'lucide-react';
import React, { useState } from 'react';
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState(null);
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  // Enhanced input validation
  const validateInputs = () => {
    if (!input) {
      toast.error("Please select an image file.");
      return false;
    }

    // File size check (10MB limit)
    if (input.size > 10 * 1024 * 1024) {
      toast.error("File size too large. Please upload an image smaller than 10MB.");
      return false;
    }

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(input.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, or WebP images only.");
      return false;
    }

    // Object description validation
    if (!object.trim()) {
      toast.error("Please describe the object you want to remove.");
      return false;
    }

    if (object.trim().length < 3) {
      toast.error("Please provide a more detailed description (at least 3 characters).");
      return false;
    }

    if (object.trim().split(/\s+/).length < 2) {
      toast.error("Please provide a more detailed description with at least 2 words.");
      return false;
    }

    // Check for inappropriate content (basic filter)
    const inappropriateWords = ['explicit', 'nsfw', 'adult'];
    if (inappropriateWords.some(word => object.toLowerCase().includes(word))) {
      toast.error("Please use appropriate language in your description.");
      return false;
    }

    return true;
  };

  // Download image function
  const downloadImage = async () => {
    if (!content) return;

    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `removed-object-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy URL. Please try again.");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      setContent("");
      setCopied(false);

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object.trim());

      console.log("Sending request to:", "/api/ai/remove-object");
      console.log("FormData contents:", { 
        image: input?.name, 
        size: `${(input?.size / 1024 / 1024).toFixed(2)}MB`,
        type: input?.type,
        object: object.trim() 
      });

      const { data } = await axios.post("/api/ai/remove-object", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        timeout: 60000, // 60 second timeout
      });

      console.log("Full response data:", data);

      // Handle successful response
      if (data.success) {
        console.log("Checking data properties:", {
          content: data.content,
          resultImage: data.resultImage,
          image: data.image,
          url: data.url
        });

        const imageUrl = data.content || data.resultImage || data.image || data.url;
        
        if (imageUrl) {
          console.log("Setting image URL:", imageUrl);
          setContent(imageUrl);
          toast.success("Object removed successfully!");
        } else {
          console.error("No image URL found in response:", data);
          toast.error("Object removed but failed to load result image");
        }
      } else {
        console.error("API returned success: false", data);
        toast.error(data.message || "Failed to remove object");
      }

    } catch (error) {
      console.error("Remove object error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          toast.error("This feature is only available for premium users.");
        } else if (status === 413) {
          toast.error("File too large. Please upload a smaller image.");
        } else if (status === 400) {
          toast.error(message || "Invalid request. Please check your inputs.");
        } else if (status === 404) {
          toast.error("API endpoint not found. Please check your server configuration.");
        } else if (status === 408 || error.code === 'ECONNABORTED') {
          toast.error("Request timeout. Please try again with a smaller image.");
        } else {
          toast.error(message || `Server error (${status}). Please try again.`);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 items-start flex-wrap gap-4 text-slate-700'>
      <div className='flex flex-col md:flex-row gap-6'>

        {/* LEFT: Form */}
        <form
          onSubmit={onSubmitHandler}
          className='w-full md:w-1/2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm'
        >
          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 text-[#4A7AFF]' />
            <h1 className='text-lg font-semibold'>Object Removal</h1>
          </div>

          <label className='mt-6 block text-sm font-medium'>Upload Image</label>
          <input
            type='file'
            accept='.jpg,.jpeg,.png,.webp'
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setInput(file);
              if (file) {
                console.log("File selected:", {
                  name: file.name,
                  size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
                  type: file.type
                });
              }
            }}
            className='w-full mt-2 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            required
          />
          {input && (
            <p className='text-xs text-gray-500 mt-1'>
              Selected: {input.name} ({(input.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          )}

          <label className='mt-6 block text-sm font-medium'>Describe object to remove</label>
          <textarea
            onChange={(e) => setObject(e.target.value)}
            value={object}
            rows={4}
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='e.g. "remove the person in the background", "delete the car on the left", "erase the watermark"'
            required
            maxLength={200}
          />
          <p className='text-xs text-gray-500 mt-1'>
            {object.length}/200 characters • {object.trim().split(/\s+/).filter(word => word).length} words
          </p>

          <button
            type='submit'
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8e37eb] hover:from-[#3468E3] hover:to-[#7A2DDC] transition-all duration-300 text-white px-4 py-2 mt-6 text-sm rounded-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Scissors className='w-5' />
            {loading ? "Processing..." : "Remove Object"}
          </button>
        </form>

        {/* RIGHT: Output Preview */}
        <div className='w-full md:w-1/2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col'>
          <div className='flex items-center gap-3 mb-4'>
            <Eraser className='w-5 h-5 text-[#FF4938]' />
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>

          <div className='flex-1 flex justify-center items-center'>
            {loading ? (
              <div className='flex flex-col items-center gap-3'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#417DF6]'></div>
                <p className='text-gray-400 text-sm'>Processing...</p>
              </div>
            ) : content ? (
              <img
                src={content}
                alt='Processed Output'
                className='max-w-full max-h-[400px] object-contain rounded-lg border border-gray-200'
                onError={() => {
                  console.error("Image failed to load:", content);
                  toast.error("Failed to load processed image");
                  setContent("");
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", content);
                }}
              />
            ) : (
              <div className='text-sm flex flex-col items-center gap-3 text-gray-400'>
                <ImageIcon className='w-8 h-8' />
                <p>Processed image will appear here...</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {content && (
            <div className='mt-4 flex gap-2'>
              <button
                onClick={downloadImage}
                className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm'
              >
                <Download className='w-4 h-4' />
                Download
              </button>
              
              <button
                onClick={copyToClipboard}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm'
              >
                {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          )}

          {/* Debug info */}
          {content && (
            <div className='mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600 break-all'>
              <strong>Image URL:</strong> {content.substring(0, 100)}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;