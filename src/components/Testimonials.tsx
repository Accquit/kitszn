
import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Kshitij",
      role: "Jee Aspirant",
      content: "The quality is incredible! My custom Lakers jersey looks and feels just like the authentic ones. The customization options are amazing.",
      rating: 5,
      image: ""
    },
    {
      id: 2,
      name: "Raghav Pandya",
      role: "Sports Fan",
      content: "Fast shipping and perfect fit. I've ordered three jerseys now and each one exceeded my expectations. Highly recommend!",
      rating: 5,
      image: ""
    },
    {
      id: 3,
      name: "Pratham Bhatia",
      role: "Collector",
      content: "As someone who collects vintage jerseys, I can say these are top-notch. The attention to detail and material quality is outstanding.",
      rating: 5,
      image: ""
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black/20 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Space_Grotesk'] text-gradient mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their premium jersey needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="glass-card rounded-xl p-6 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-blue-400 opacity-50" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Customer info */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gradient">5+</div>
            <p className="text-gray-400">Happy Customers</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gradient">4.9/5</div>
            <p className="text-gray-400">Average Rating</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gradient">100%</div>
            <p className="text-gray-400">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
