# QuikAI - AI-Powered Tools Platform

A modern React-based platform offering various AI tools including article writing, image generation, background removal, and more. Built with cutting-edge technologies for seamless user experience.

## 🚀 Features

- **AI Article Writer** - Generate high-quality, engaging articles on any topic
- **Blog Title Generator** - Create catchy titles for your blog posts
- **AI Image Generation** - Create stunning visuals with AI
- **Background Removal** - Remove backgrounds from images effortlessly
- **Object Removal** - Remove unwanted objects from images
- **Resume Reviewer** - Get AI-powered resume feedback

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- A Clerk account for authentication

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/QuikAI.git
   cd QuikAI/Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   VITE_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication public key | Yes |
| `VITE_BASE_URL` | Backend API base URL | Yes |

## 📁 Project Structure

```
Client/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── assets.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AboutUs.jsx
│   │   └── AI/
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key to your `.env` file
4. Configure authentication settings in your Clerk dashboard

## 🌟 Key Components

### Navbar
- Responsive navigation with authentication
- Logo and navigation links
- User profile integration

### About Us Page
- Team information
- Company stats and values
- Contact functionality

### AI Tools
- Modular tool cards
- Gradient backgrounds
- Interactive interfaces

## 🎯 Features Overview

### Authentication
- Secure login/signup with Clerk
- User profile management
- Protected routes

### AI Tools Integration
- Article writing with AI
- Image generation and manipulation
- Resume analysis and feedback

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Modern glassmorphism effects

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rishabh Farkade**
- LinkedIn: [rishabh-farkade](https://www.linkedin.com/in/rishabh-farkade-91600a263)
- GitHub: [Rishabh001pawar](https://github.com/Rishabh001pawar)

## 🆘 Support

If you have any questions or run into issues, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core AI tools
- **v1.1.0** - Added authentication and user profiles
- **v1.2.0** - Enhanced UI/UX and mobile responsiveness

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons
- [Vite](https://vitejs.dev) for build tooling

---

Made with ❤️ by the QuikAI [Rishabh pawar]
