import React from 'react';
import { Github, Linkedin, Twitter, Mail, Award, Users, Target, Heart, Zap, Shield, Globe, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const team = [
  {
    name: 'Rishabh Farkade',
    role: 'Founder & CEO',
    specialty: 'Software Engineer | Software Development',
    image: assets.image5 || 'https://ui-avatars.com/api/?name=Rishabh+Farkade&size=150&background=4F46E5&color=fff&bold=true',
    bio: 'Passionate about creating secure and innovative AI solutions that make technology accessible to everyone.',
    linkedin:'https://www.linkedin.com/in/rishabh-farkade-91600a263',
    github: 'https://github.com/Rishabh001pawar',    
  }
];

const stats = [
  { icon: Users, label: 'Active Users', value: '' },
  { icon: Award, label: 'Projects Completed', value: '' },
  { icon: Globe, label: 'Countries Served', value: '' },
  { icon: Zap, label: 'AI Tools Created', value: '' },
];

const values = [
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Pushing boundaries with cutting-edge AI and automation technologies'
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Privacy and security by design in every solution we create'
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Making technology inclusive and accessible to everyone worldwide'
  },
  {
    icon: Rocket,
    title: 'Growth',
    description: 'Student-led and community-driven approach to sustainable growth'
  },
];

const AboutUs = () => {

    const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/');
  };

  const handleContactUs = () => {
    try {
      // Alternative method using window.open for better compatibility
      const subject = encodeURIComponent('Contact from QuikAI About Page');
      const body = encodeURIComponent('Hi QuikAI Team,\n\nI would like to get in touch with you regarding...');
      const mailtoLink = `mailto:rishabhpawar059@gmail.com?subject=${subject}&body=${body}`;
      
      window.open(mailtoLink, '_self');
    } catch (error) {
      // Fallback: copy email to clipboard and show alert
      navigator.clipboard.writeText('rishabhpawar059@gmail.com').then(() => {
        alert('Email copied to clipboard: rishabhpawar059@gmail.com');
      }).catch(() => {
        alert('Please contact us at: rishabhpawar059@gmail.com');
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About Quick.ai
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering the future through innovative AI solutions, built by students for the global community
          </p>
          
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* Mission & Vision */}
        <section className="py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-indigo-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To democratize artificial intelligence by creating accessible, secure, and innovative tools that empower individuals and organizations to harness the power of AI for positive impact.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-purple-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become the leading platform where students, developers, and innovators collaborate to build the next generation of AI-powered solutions that solve real-world problems.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
       <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate innovators dedicated to building the future of AI technology
            </p>
          </div>
          
          {/* Centered single team member */}
          <div className="flex justify-center">
            <div className="max-w-sm">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
                  <div className="text-center mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-100 shadow-lg"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                    <p className="text-indigo-600 font-semibold mb-2">{member.role}</p>
                    <p className="text-sm text-gray-500 mb-4">{member.specialty}</p>
                  </div>
                  
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="w-6 h-6 text-blue-600" />
                    </a>
                    <a 
                      href={member.github}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Github className="w-6 h-6 text-gray-700" />
                    </a>
                   
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to Join Our Journey?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Be part of the AI revolution. Connect with us and help shape the future of technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-white text-indigo-600 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold cursor-pointer"
              >
                Get Started
              </button>
              <button 
                onClick={handleContactUs}
                className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105 font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;