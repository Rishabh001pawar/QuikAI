import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import FormData from 'form-data';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';


const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const genrateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        Success: false,
        message:
          "Free usage limit exceeded. Upgrade to premium for unlimited access.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [      
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,  
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if(plan!== "premium") {
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.log(error.message)
    res.json({success: false, message: "Failed to generate article", error: error.message});
  }
};


export const genrateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        Success: false,
        message:
          "Free usage limit exceeded. Upgrade to premium for unlimited access.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [      
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,  
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if(plan!== "premium") {
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.log(error.message)
    res.json({success: false, message: "Failed to generate article", error: error.message});
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message: 'This feature is only available for premium users.',
      });
    }

    const formData = new FormData();
    formData.append('prompt', prompt);

    // Use the correct text-to-image endpoint
    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY,
        ...formData.getHeaders(),
      },
      responseType: 'arraybuffer',
    });

    const base64Image = 'data:image/png;base64,' + Buffer.from(data, 'binary').toString('base64');
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.log(error.message)
    res.json({success: false, message: "Failed to generate image", error: error.message});
  }
};


// ...existing code...
export const removeImageBackground = async (req, res) => {
  try {
    console.log('=== REMOVE BACKGROUND API CALLED ===');
    
    // Use consistent auth method like other functions
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan; // This should come from middleware

    console.log('User ID:', userId);
    console.log('User Plan:', plan);
    console.log('File received:', !!image);
    console.log('File details:', image ? {
      originalname: image.originalname,
      mimetype: image.mimetype,
      size: image.size
    } : 'No file');

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Temporarily comment out premium check for testing
    if (plan !== 'premium') {
      console.log('Plan check failed. Current plan:', plan);
      return res.status(403).json({
        success: false,
        message: 'This feature is only available for premium users. Current plan: ' + (plan || 'free')
      });
    }

    // Check ClipDrop API key
    if (!process.env.CLIPDROP_API_KEY) {
      console.error('CLIPDROP_API_KEY not found');
      return res.status(500).json({
        success: false,
        message: 'Service configuration error'
      });
    }

    console.log('Creating FormData for ClipDrop API...');
    
    // Fix: Use the imported FormData, not require
    const formData = new FormData();
    formData.append('image_file', image.buffer, {
      filename: image.originalname,
      contentType: image.mimetype,
    });

    console.log('Making request to ClipDrop API...');

    const { data } = await axios.post(
      'https://clipdrop-api.co/remove-background/v1',
      formData,
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      }
    );

    console.log('ClipDrop API successful, converting to base64...');

    const base64Image = Buffer.from(data).toString('base64');
    const imageDataUrl = `data:image/png;base64,${base64Image}`;

    // Store in database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${imageDataUrl}, 'image-background-removal')
    `;

    console.log('Background removal successful');

    res.json({ 
      success: true, 
      content: imageDataUrl,
      message: 'Background removed successfully'
    });

  } catch (error) {
    console.error('=== REMOVE BACKGROUND ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    if (error.response?.status === 400) {
      res.status(400).json({
        success: false,
        message: 'Invalid image format or corrupted file'
      });
    } else if (error.response?.status === 403) {
      res.status(403).json({
        success: false,
        message: 'API quota exceeded or invalid API key'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to remove background: ' + error.message
      });
    }
  }
};


export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    if (!object || object.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description of the object to remove'
      });
    }

    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message: 'This feature is only available for premium users.',
      });
    }
    
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(image.buffer);
    });

    const imageUrl = uploadResult.secure_url;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image-object-removal')
    `;

    res.json({ 
      success: true, 
      content: imageUrl,
      resultImage: imageUrl 
    });

  } catch (error) {
    console.error('Remove object error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to remove object: " + error.message
    });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    console.log('Resume review request:', { userId, hasFile: !!resume, plan });

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided'
      });
    }

    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message: 'This feature is only available for premium users.',
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Resume file size exceeds 5MB limit.',
      });
    }

    // Since we're using memory storage, use resume.buffer instead of fs.readFileSync
    const pdfData = await pdf(resume.buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF. Please ensure it contains readable text.',
      });
    }

    const prompt = `Review the following resume and provide feedback on how to improve it:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [      
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,  
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });

  } catch (error) {
    console.error('Resume review error:', error);
    res.status(500).json({
      success: false, 
      message: "Failed to review resume: " + error.message
    });
  }
};



// export const getPublishedCreations = async (req, res) => {
//   try {
//     console.log('Fetching published creations...');
    
//     // Get published creations - use 'publish' instead of 'published'
//     const creations = await sql`
//       SELECT 
//         id,
//         user_id,
//         prompt,
//         content,
//         type,
//         created_at,
//         likes
//       FROM creations
//       WHERE publish = true
//       ORDER BY created_at DESC
//       LIMIT 50
//     `;

//     console.log(`Found ${creations.length} published creations`);

//     // Format the response
//     const formattedCreations = creations.map(creation => ({
//       _id: creation.id,
//       user_id: creation.user_id,
//       prompt: creation.prompt,
//       content: creation.content,
//       type: creation.type,
//       created_at: creation.created_at,
//       likes: creation.likes || [],
//       user: {
//         firstName: 'Anonymous', // You can enhance this with actual user data
//         email: 'user@example.com'
//       }
//     }));

//     res.json({
//       success: true,
//       creations: formattedCreations
//     });

//   } catch (error) {
//     console.error('Get published creations error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch published creations: ' + error.message
//     });
//   }
// };



