import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Cube } from 'lucide-react';
import { Link } from 'react-router-dom';

type GalleryCategory = 'all' | 'courts' | 'labs' | 'vertical-farm' | 'architecture' | 'technology';

interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  description: string;
  aspectRatio: '16/9' | '4/3' | '1/1';
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: 'Natural Grass Court',
    category: 'courts',
    description: 'State-of-the-art natural grass tennis court with advanced irrigation and drainage systems',
    aspectRatio: '16/9'
  },
  {
    id: 2,
    title: 'Clay Court Complex',
    category: 'courts',
    description: 'Professional clay courts with precise moisture control and optimal playing surface',
    aspectRatio: '16/9'
  },
  {
    id: 3,
    title: 'Hard Court Arena',
    category: 'courts',
    description: 'Modern hard court with shock-absorbing acrylic surface technology',
    aspectRatio: '16/9'
  },
  {
    id: 4,
    title: 'Indoor Wood Court',
    category: 'courts',
    description: 'Rare indoor wood court featuring sustainable materials and climate control',
    aspectRatio: '16/9'
  },
  {
    id: 5,
    title: 'Biometric Analysis Lab',
    category: 'labs',
    description: 'Advanced biometric testing facility with motion capture and performance analytics',
    aspectRatio: '4/3'
  },
  {
    id: 6,
    title: 'Cognitive Training Center',
    category: 'labs',
    description: 'Neurofeedback and cognitive enhancement laboratory for mental performance optimization',
    aspectRatio: '4/3'
  },
  {
    id: 7,
    title: 'Recovery Suite',
    category: 'labs',
    description: 'Comprehensive recovery facility with cryotherapy, hydrotherapy, and rehabilitation equipment',
    aspectRatio: '1/1'
  },
  {
    id: 8,
    title: 'Vertical Farm Towers',
    category: 'vertical-farm',
    description: 'Multi-story vertical farming system for sustainable grass cultivation and research',
    aspectRatio: '4/3'
  },
  {
    id: 9,
    title: 'Hydroponic Growth Chambers',
    category: 'vertical-farm',
    description: 'Precision-controlled hydroponic environment for accelerated grass growth studies',
    aspectRatio: '16/9'
  },
  {
    id: 10,
    title: 'Building Exterior',
    category: 'architecture',
    description: 'Modern architectural design featuring sustainable materials and energy-efficient systems',
    aspectRatio: '16/9'
  },
  {
    id: 11,
    title: 'Grand Lobby',
    category: 'architecture',
    description: 'Expansive reception area with natural lighting and contemporary design elements',
    aspectRatio: '4/3'
  },
  {
    id: 12,
    title: 'Central Control Room',
    category: 'technology',
    description: 'Integrated facility management and environmental monitoring command center',
    aspectRatio: '16/9'
  },
  {
    id: 13,
    title: 'AI Monitoring Systems',
    category: 'technology',
    description: 'Real-time AI-powered environmental and performance monitoring infrastructure',
    aspectRatio: '4/3'
  },
  {
    id: 14,
    title: 'Sustainability Hub',
    category: 'architecture',
    description: 'Green technology showcase with renewable energy and water recycling systems',
    aspectRatio: '1/1'
  }
];

const categories: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'courts', label: 'Courts' },
  { id: 'labs', label: 'Labs' },
  { id: 'vertical-farm', label: 'Vertical Farm' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'technology', label: 'Technology' }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(galleryData);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredItems(galleryData);
    } else {
      setFilteredItems(galleryData.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);

  const handlePrevious = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    const previousIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    setSelectedImage(filteredItems[previousIndex].id);
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    const nextIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(filteredItems[nextIndex].id);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage === null) return;

    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setSelectedImage(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredItems]);

  const selectedItem = selectedImage !== null
    ? galleryData.find(item => item.id === selectedImage)
    : null;

  const getCategoryColor = (category: GalleryCategory): string => {
    const colors: Record<GalleryCategory, string> = {
      all: 'bg-gray-600',
      courts: 'bg-green-600',
      labs: 'bg-blue-600',
      'vertical-farm': 'bg-emerald-600',
      architecture: 'bg-purple-600',
      technology: 'bg-orange-600'
    };
    return colors[category];
  };

  const getCategoryLabel = (category: GalleryCategory): string => {
    return categories.find(c => c.id === category)?.label || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 animate-gradient">
            Explore Our Vision
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the future of tennis through our cutting-edge facility designs,
            advanced research laboratories, and sustainable innovation centers
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-6 py-2.5 rounded-full font-medium transition-all duration-300
                  ${activeCategory === category.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/50 scale-105'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                {category.label}
                {category.id !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({galleryData.filter(item => item.category === category.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:border-green-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 animate-fadeIn"
            >
              {/* Placeholder Image */}
              <div
                className="w-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-500 overflow-hidden relative"
                style={{ aspectRatio: item.aspectRatio }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="text-4xl mb-2 opacity-20">📷</div>
                    <div className="text-sm font-medium opacity-50">{item.title}</div>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`${getCategoryColor(item.category)} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}>
                  {getCategoryLabel(item.category)}
                </span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                <div className="p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No items found in this category</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 mb-16">
        <div className="bg-gradient-to-r from-green-900/30 via-blue-900/30 to-purple-900/30 rounded-3xl p-12 text-center border border-green-500/20 backdrop-blur-sm">
          <Cube className="w-16 h-16 mx-auto mb-6 text-green-400 animate-pulse" />
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
            Experience It in 3D
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Step into our virtual facility and explore every detail of our tennis courts in an immersive 3D environment
          </p>
          <Link
            to="/court-view"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <Cube className="w-5 h-5" />
            Launch 3D Court View
          </Link>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300 group"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Content */}
          <div
            className="max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Large Image */}
            <div
              className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-6 flex items-center justify-center border-2 border-green-500/30 shadow-2xl shadow-green-500/20"
              style={{ aspectRatio: selectedItem.aspectRatio, minHeight: '400px' }}
            >
              <div className="text-center">
                <div className="text-8xl mb-4 opacity-20">📷</div>
                <div className="text-2xl font-medium text-gray-400">{selectedItem.title}</div>
              </div>
            </div>

            {/* Image Info */}
            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h3>
                  <span className={`${getCategoryColor(selectedItem.category)} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
                    {getCategoryLabel(selectedItem.category)}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  {filteredItems.findIndex(item => item.id === selectedImage) + 1} / {filteredItems.length}
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
