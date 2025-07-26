import { Sparkles, Image } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenrateImages = () => {
  const ImageStyle = [
    "Realistic",
    "Cartoon",
    "Abstract",
    "Minimalist",
    "Vintage",
    "Futuristic",
    "Fantasy",
    "Ghibli",
    "Cyberpunk",
    "3D",
    "Anime",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style of ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/genrate-image",
        { prompt, style: selectedStyle, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to generate image");
    }
    setLoading(false);
  };

  
  return (
    <div className="h-full overflow-y-scroll p-6 text-slate-700">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT: Image Generator Form */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full md:w-1/2 p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 text-[#00AD25]" />
            <h1 className="text-lg font-semibold">AI Image Generator</h1>
          </div>

          <p className="mt-6 text-sm font-medium">Describe your image</p>
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            rows={4}
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="Describe the image you want to generate"
            required
          />

          <p className="mt-4 text-sm font-medium">Image Style</p>
          <div className="mt-3 flex gap-3 flex-wrap">
            {ImageStyle.map((item) => (
              <span
                onClick={() => setSelectedStyle(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                  selectedStyle === item
                    ? "bg-green-50 text-green-700"
                    : "text-gray-500 border-gray-300"
                }`}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="my-6 flex items-center gap-2">
            <label className="relative cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => setPublish(e.target.checked)}
                checked={publish}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
              <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
            </label>
            <p className="text-sm text-gray-500">Publish to Gallery</p>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : (
              <Image className="w-5" />
            )}
            Generate Image
          </button>
        </form>

        {/* RIGHT: Generated Image Display */}
        <div className="w-full md:w-1/2 p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[300px]">
          <div className="flex items-center gap-3 mb-4">
            <Image className="w-5 h-5 text-[#00AD25]" />
            <h1 className="text-xl font-semibold">Generated Image</h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <Image className="w-6 h-9" />
                <p>Enter a prompt to generate an image</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
              <img
                src={content}
                alt="Generated"
                className="w-full h-auto rounded-md"
              />

              <div className="mt-4 flex gap-4">
                {/* Download Button */}
                <a
                  href={content}
                  download="generated-image.png"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg"
                >
                  Download
                </a>

                {/* Share Button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Check out this AI-generated image!",
                          text: "Here's an image I generated using AI.",
                          url: content,
                        })
                        .then(() => toast.success("Shared successfully!"))
                        .catch((err) => console.log("Share failed:", err));
                    } else {
                      navigator.clipboard.writeText(content);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg"
                >
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenrateImages;
