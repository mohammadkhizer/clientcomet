import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

export const SITE_NAME = "Client Comet";
export const SITE_DESCRIPTION = "Premium IT services and solutions for businesses of all sizes";

export const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Projects", href: "/projects" },
  { title: "Team", href: "/team" },
  { title: "Contact", href: "/contact" },
];

export const SERVICES = [
  {
    id: "networking",
    title: "Computer Networking",
    description: "Design, implementation and maintenance of secure and efficient network infrastructure for businesses of all sizes.",
    icon: "Network",
    features: [
      "Network design and consulting",
      "Installation and configuration",
      "Network security",
      "Troubleshooting and maintenance",
      "Cloud networking solutions"
    ]
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Custom web applications and websites designed to meet your specific business needs and objectives.",
    icon: "Globe",
    features: [
      "Responsive web design",
      "E-commerce solutions",
      "Content management systems",
      "Web application development",
      "API integrations"
    ]
  },
  {
    id: "mobile-development",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android to expand your business reach.",
    icon: "Smartphone",
    features: [
      "iOS app development",
      "Android app development",
      "Cross-platform solutions",
      "App maintenance and updates",
      "App store optimization"
    ]
  },
  {
    id: "computer-services",
    title: "Computer Sales & Services",
    description: "High-quality computer hardware, software, and repair services for individuals and businesses.",
    icon: "Computer",
    features: [
      "Hardware sales and installation",
      "Software licensing and deployment",
      "Computer repair and maintenance",
      "Data recovery services",
      "IT consultation"
    ]
  },
  {
    id: "graphics-design",
    title: "Graphics Design",
    description: "Creative design solutions including branding, marketing materials, and digital assets for your business.",
    icon: "Palette",
    features: [
      "Logo and brand identity",
      "Print design",
      "Digital marketing assets",
      "UI/UX design",
      "Illustration and infographics"
    ]
  },
  {
    id: "media-editing",
    title: "Video & Photo Editing",
    description: "Professional video and photo editing services to enhance your visual content and engagement.",
    icon: "Video",
    features: [
      "Video editing and post-production",
      "Photo retouching and enhancement",
      "Motion graphics and animation",
      "Corporate video production",
      "Social media content creation"
    ]
  }
];

export const PROJECTS = [
  {
    id: "1",
    title: "Enterprise Network Infrastructure",
    category: "Computer Networking",
    description: "Complete network redesign and implementation for a large corporation with multiple locations.",
    image: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg",
    technologies: ["Cisco", "VMware", "Cloud Infrastructure", "Security Protocols"]
  },
  {
    id: "2",
    title: "E-commerce Platform",
    category: "Web Development",
    description: "Custom e-commerce solution with advanced inventory management and payment processing.",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
    technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
  },
  {
    id: "3",
    title: "Health Tracking Mobile App",
    category: "Mobile App Development",
    description: "Cross-platform mobile application for health tracking with wearable device integration.",
    image: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
    technologies: ["React Native", "Firebase", "Bluetooth Integration", "Health APIs"]
  },
  {
    id: "4",
    title: "Corporate Brand Identity",
    category: "Graphics Design",
    description: "Complete brand identity design including logo, stationery, and brand guidelines.",
    image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
    technologies: ["Adobe Creative Suite", "Brand Strategy", "Typography", "Color Theory"]
  },
  {
    id: "5",
    title: "Product Demo Video",
    category: "Video & Photo Editing",
    description: "Professional product demonstration video with motion graphics and voiceover.",
    image: "https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg",
    technologies: ["After Effects", "Premier Pro", "Sound Design", "Animation"]
  },
  {
    id: "6",
    title: "Small Business IT Setup",
    category: "Computer Sales & Services",
    description: "Complete hardware and software setup for a growing business with ongoing support.",
    image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
    technologies: ["Hardware Selection", "Windows Server", "Data Backup", "Security Implementation"]
  }
];

export const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Mohammed Khizer Shaikh",
    role: "Founder & CEO",
    bio: "With over 15 years in the IT industry, Sarah brings leadership and vision to every project.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQHuYiRKmcDpSw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711185113205?e=1751500800&v=beta&t=P6Uvbdu7W4odHK06SX6aykxbvhCJcbYwIH6IGpqLd-U",
    social: [
      { icon: Linkedin, url: "https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275/" },
      { icon: Twitter, url: "https://twitter.com" }
    ]
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Technical Director",
    bio: "Michael is an expert in network infrastructure and cybersecurity with 10+ years of experience.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    social: [
      { icon: Linkedin, url: "https://linkedin.com" },
      { icon: Github, url: "https://github.com" }
    ]
  },
  {
    id: "3",
    name: "Jessica Rodriguez",
    role: "Lead Developer",
    bio: "Jessica specializes in full-stack development with expertise in modern web technologies.",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    social: [
      { icon: Github, url: "https://github.com" },
      { icon: Twitter, url: "https://twitter.com" }
    ]
  },
  {
    id: "4",
    name: "David Park",
    role: "Mobile Developer",
    bio: "David is an experienced mobile developer proficient in both iOS and Android platforms.",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    social: [
      { icon: Linkedin, url: "https://linkedin.com" },
      { icon: Github, url: "https://github.com" }
    ]
  },
  {
    id: "5",
    name: "Emma Wilson",
    role: "Creative Director",
    bio: "Emma leads our design team with a keen eye for aesthetics and user experience.",
    image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg",
    social: [
      { icon: Instagram, url: "https://instagram.com" },
      { icon: Linkedin, url: "https://linkedin.com" }
    ]
  },
  {
    id: "6",
    name: "Robert Taylor",
    role: "IT Support Specialist",
    bio: "Robert excels at troubleshooting and providing reliable technical support.",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    social: [
      { icon: Linkedin, url: "https://linkedin.com" },
      { icon: Facebook, url: "https://facebook.com" }
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: "1",
    name: "John Smith",
    company: "Acme Corporation",
    content: "Client Comet transformed our outdated network infrastructure into a modern, secure system. Their team was professional and knowledgeable throughout the entire process.",
    image: "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg"
  },
  {
    id: "2",
    name: "Lisa Wong",
    company: "Green Retail",
    content: "The e-commerce platform developed by Client Comet has significantly increased our online sales. Their ongoing support ensures our business runs smoothly.",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg"
  },
  {
    id: "3",
    name: "Mark Johnson",
    company: "Innovate Health",
    content: "The mobile app developed by Client Comet has received outstanding feedback from our users. Their attention to detail and focus on user experience is exceptional.",
    image: "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg"
  }
];

export const CONTACT_INFO = {
  address: "123 Tech Street, Innovation City, IC 12345",
  email: "info@clientcomet.com",
  phone: "+1 (555) 123-4567",
  hours: "Monday - Friday: 9AM - 6PM"
};

export const SOCIAL_LINKS = [
  { icon: Facebook, url: "https://facebook.com" },
  { icon: Twitter, url: "https://twitter.com" },
  { icon: Instagram, url: "https://instagram.com" },
  { icon: Linkedin, url: "https://linkedin.com" },
  { icon: Github, url: "https://github.com" }
];