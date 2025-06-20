
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background with basketball court image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1920&q=80"
          alt="Basketball court background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            {/* Main content */}
            <div className="space-y-8 animate-fade-in">
              {/* Main headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white font-['Space_Grotesk']">
                  Perfection in Every
                  <span className="block text-gradient-accent">Game</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Crafting premium jerseys with cutting-edge design and authentic materials for unmatched performance on and off the court.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-8 py-4 bg-[#cc73f8] text-white font-semibold rounded-lg hover:bg-[#b85df0] transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
