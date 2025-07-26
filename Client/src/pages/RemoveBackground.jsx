import React, { useState } from "react";
import { Sparkles, Eraser, Download, RefreshCw } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const { getToken } = useAuth();

  // State Declarations
  const [input, setInput] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setLoading(true);

      // Debug logging
      console.log("Base URL:", axios.defaults.baseURL);
      console.log("File info:", {
        name: input.name,
        size: input.size,
        type: input.type,
        sizeInMB: (input.size / (1024 * 1024)).toFixed(2)
      });

      const formData = new FormData();
      formData.append("image", input);

      const token = await getToken();
      if (!token) {
        toast.error("Authentication failed. Please sign in.");
        setLoading(false);
        return;
      }

      console.log("Making API request to:", `${axios.defaults.baseURL}/api/ai/remove-image-background`);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000, // 2 minute timeout for background removal
        }
      );

      console.log("API Response:", data);

      if (data.success) {
        setContent(data.content);
        toast.success("Background removed successfully!");
      } else {
        console.error("API returned success: false:", data);
        toast.error(data.message || "Failed to process image.");
      }
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please try with a smaller image.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 413) {
        toast.error("Image file too large. Please use a smaller image.");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid image format or request.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.response?.status === 404) {
        toast.error("API endpoint not found. Please check server configuration.");
      } else if (!error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(error.response?.data?.message || "Failed to remove background.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!content) {
      toast.error("No processed image to download");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = content;
      link.download = `background-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  const resetForm = () => {
    setInput(null);
    setPreview(null);
    setContent(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        resetForm();
        return;
      }
      
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        resetForm();
        return;
      }

      // Check for supported formats
      const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!supportedFormats.includes(file.type)) {
        toast.error("Supported formats: JPG, PNG, WebP");
        resetForm();
        return;
      }
      
      setInput(file);
      setPreview(URL.createObjectURL(file));
      // Clear any previous results
      setContent(null);
    } else {
      resetForm();
    }
  };

  return (
    <div className="h-full min-h-screen bg-gray-50 p-6 text-slate-700">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL - Upload */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full lg:w-1/2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 text-[#FF4938]" />
              <h1 className="text-xl font-semibold">Remove Background</h1>
            </div>
            {(input || content) && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="Reset"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              onChange={handleFileChange}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="w-full text-sm p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FF4938] focus:border-transparent transition-all"
              required
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Supported: JPG, PNG, WebP</p>
              <p>Max size: 10MB</p>
            </div>
          </div>

          {preview && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2 text-gray-600">Preview</p>
              <div className="relative">
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="w-full max-h-[300px] object-contain rounded-md border bg-gray-50"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {input && `${(input.size / (1024 * 1024)).toFixed(2)} MB`}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !input}
            className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-3 text-sm rounded-lg transition-all hover:brightness-110 ${
              loading || !input ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Eraser className="w-5" />
            )}
            <span>{loading ? "Processing..." : "Remove Background"}</span>
          </button>

          {loading && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Processing your image...</p>
              <p className="text-xs text-gray-400 mt-1">This may take up to 2 minutes</p>
            </div>
          )}
        </form>

        {/* RIGHT PANEL - Output */}
        <div className="w-full lg:w-1/2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Eraser className="w-5 h-5 text-[#FF4938]" />
              <h1 className="text-xl font-semibold">Processed Image</h1>
            </div>
            {content && (
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>

          <div className="flex-1 flex justify-center items-center">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-[#FF4938] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Processing your image...</p>
                <p className="text-sm text-gray-400 mt-2">AI is removing the background</p>
              </div>
            ) : !content ? (
              <div className="text-sm text-center text-gray-400 flex flex-col items-center gap-3">
                <Eraser className="w-8 h-8" />
                <div>
                  <p className="font-medium">Your processed image will appear here</p>
                  <p className="text-xs mt-1">Upload an image and click "Remove Background"</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="relative max-w-full">
                  <img
                    src={content}
                    alt="Processed with background removed"
                    className="max-w-full max-h-[400px] object-contain rounded-md border shadow-lg"
                    onError={() => {
                      console.error("Failed to load processed image");
                      toast.error("Failed to load processed image");
                      setContent(null);
                    }}
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Done
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                  <button
                    onClick={() => {
                      setContent(null);
                      toast.success("Ready for next image");
                    }}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Process Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;