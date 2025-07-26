import { FileText, Sparkles, Download } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a resume (PDF only)");
      return;
    }

    // File size validation (5MB limit based on backend)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Please upload a PDF smaller than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setResult(""); // Clear previous result

      console.log("Sending request to:", "/api/ai/resume-review");
      console.log("File details:", {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type
      });

      const { data } = await axios.post("/api/ai/resume-review", formData, { // Changed this line
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        timeout: 60000, // 60 second timeout
      });

      console.log("Response data:", data);

      if (data.success) {
        setResult(data.content); // Backend returns 'content', not 'result'
        toast.success("Resume reviewed successfully!");
      } else {
        toast.error(data.message || "Resume review failed");
      }
    } catch (error) {
      console.error("Resume Review Error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 403) {
          toast.error("This feature is only available for premium users.");
        } else if (status === 413) {
          toast.error("File too large. Please upload a smaller PDF.");
        } else if (status === 400) {
          toast.error(message || "Invalid file. Please upload a valid PDF.");
        } else if (status === 404) {
          toast.error("API endpoint not found. Please check your server configuration.");
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

  const downloadReview = () => {
    if (!result) return;
    
    try {
      const blob = new Blob([result], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Resume_Review_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success("Review downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download review. Please try again.");
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 text-slate-700">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT: Upload Form */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full md:w-1/2 p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 text-[#00DA83]" />
            <h1 className="text-lg font-semibold">Resume Review</h1>
          </div>

          <p className="mt-6 text-sm font-medium">Upload Resume</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              if (selectedFile) {
                console.log("File selected:", {
                  name: selectedFile.name,
                  size: `${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`,
                  type: selectedFile.type
                });
              }
            }}
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
          <p className="text-xs text-gray-500 font-light mt-1">
            Supported format: PDF only (Max 5MB)
          </p>
          {file && (
            <p className='text-xs text-gray-500 mt-1'>
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD83] to-[#009BB3] hover:from-[#00954A] hover:to-[#007A8A] transition-all duration-300 text-white px-4 py-2 mt-6 text-sm rounded-lg ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                <FileText className="w-5" />
                Review Resume
              </>
            )}
          </button>
        </form>

        {/* RIGHT: Resume Review Output */}
        <div className="w-full md:w-1/2 p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[600px]">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[#FF4938]" />
            <h1 className="text-xl font-semibold">Resume Review</h1>
          </div>

          {/* Output Box */}
          <div className="flex-1 border rounded-md p-4 text-sm overflow-y-auto h-[480px] bg-gray-50 text-gray-700 relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
                <p>Analyzing your resume...</p>
              </div>
            ) : result ? (
              <Markdown>{result}</Markdown> 
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText className="w-8 h-8 mb-3" />
                <p>Resume review will appear here...</p>
              </div>
            )}
          </div>

          {/* Download Button */}
          {result && (
            <button
              onClick={downloadReview}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-white bg-gradient-to-r from-[#FF4938] to-[#F98B45] hover:from-[#E63946] hover:to-[#F77F00] transition-all duration-300 px-4 py-2 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;