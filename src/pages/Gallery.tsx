import React from 'react';
import { motion } from 'framer-motion';

const Gallery: React.FC = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1622163642998-1ea36b1dde3b?q=80&w=2070",
      title: "Tennis Courts",
      category: "Courts"
    },
    {
      url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070",
      title: "Indoor Facility",
      category: "Facility"
    },
    {
      url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2072",
      title: "Pickleball Court",
      category: "Courts"
    },
    {
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070",
      title: "Performance Gym",
      category: "Training"
    },
    {
      url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2070",
      title: "Vertical Farm",
      category: "Sustainability"
    },
    {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070",
      title: "Technology Hub",
      category: "Technology"
    },
    {
      url: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070",
      title: "Locker Rooms",
      category: "Amenities"
    },
    {
      url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075",
      title: "Cafe & Lounge",
      category: "Amenities"
    },
    {
      url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070",
      title: "Badminton Courts",
      category: "Courts"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Facility <span className="text-tennis-yellow">Gallery</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our state-of-the-art facilities and see what makes LawnTech Dynamics unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs font-bold text-tennis-yellow uppercase tracking-wider mb-2 block">
                    {image.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">{image.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">
            Want to see more? Schedule a virtual tour or visit us in person.
          </p>
          <button className="bg-tennis-yellow text-tennis-dark font-bold px-8 py-4 rounded-full hover:bg-white transition-all">
            Schedule a Tour
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Gallery;
