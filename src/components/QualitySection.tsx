
import React from "react";
import { Shield, Award, Sparkles, Star } from "lucide-react";

const QualitySection = () => {
  const qualityFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "Premium Materials",
      description: "High-grade polyester blend with moisture-wicking technology for ultimate comfort and durability."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-400" />,
      title: "Authentic Design",
      description: "Officially licensed designs with precise team colors and authentic logos that won't fade or crack."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      title: "Superior Craftsmanship",
      description: "Double-stitched seams and reinforced construction ensure your jersey will last through countless games."
    },
    {
      icon: <Star className="w-8 h-8 text-purple-400" />,
      title: "Performance Ready",
      description: "Lightweight, breathable fabric designed for peak performance on and off the court."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] text-gradient mb-6">
            Uncompromising Quality
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every jersey is meticulously crafted with premium materials and attention to detail, 
            ensuring you get the authentic feel and lasting quality you deserve.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {qualityFeatures.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 hover-lift animate-fade-in text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional quality showcase */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white font-['Space_Grotesk']">
              Built to Last, Made to Perform
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our jerseys undergo rigorous testing to ensure they meet the highest standards. 
              From the fabric selection to the final stitch, every detail is carefully considered 
              to deliver a product that exceeds expectations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <span className="text-gray-300">Machine washable without color fading</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <span className="text-gray-300">Reinforced stitching for maximum durability</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <span className="text-gray-300">Breathable fabric for all-day comfort</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="glass-card rounded-2xl p-2">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80"
                alt="Jersey quality close-up"
                className="rounded-xl w-full h-96 object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
