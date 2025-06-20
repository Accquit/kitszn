
import React from "react";
import { Award, Shield, Truck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedCartModal from "@/components/EnhancedCartModal";
import { useCart } from "@/contexts/CartContext";

const About = () => {
  const { cart, handleUpdateQty, handleRemoveFromCart } = useCart();
  const [cartOpen, setCartOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  const features = [
    {
      icon: <Award className="w-8 h-8 text-blue-400" />,
      title: "Authentic Quality",
      description: "Every jersey is verified for authenticity and crafted with premium materials that last."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "100% Guarantee",
      description: "We stand behind every product with our comprehensive satisfaction guarantee."
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-400" />,
      title: "Fast Shipping",
      description: "Get your jersey delivered quickly with our expedited shipping options."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Expert Support",
      description: "Our team of sports enthusiasts is here to help you find the perfect jersey."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => setCartOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 animate-fade-in font-['Space_Grotesk']">
              <span className="text-gradient">About Jersey Town</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in text-gray-300" style={{ animationDelay: '0.1s' }}>
              Born from a passion for sports and authentic memorabilia, Jersey Town has been connecting fans 
              with their favorite teams and players since 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gradient font-['Space_Grotesk']">Our Story</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                What started as a small collection of vintage jerseys in a garage has grown into one of the most 
                trusted destinations for authentic sports apparel. We believe that every jersey tells a story, 
                and every fan deserves to wear their passion with pride.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                From legendary championship runs to iconic moments that defined sports history, our carefully 
                curated collection celebrates the greatest athletes and teams of all time. Each piece is 
                authenticated and preserved to maintain its historical significance.
              </p>
            </div>
            <div className="relative">
              <div className="glass-card rounded-2xl p-2">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80"
                  alt="Sports jerseys collection"
                  className="rounded-xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4 font-['Space_Grotesk']">Why Choose Jersey Town?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best experience for sports fans worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4 font-['Space_Grotesk']">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Sports enthusiasts dedicated to bringing you the finest collection of authentic jerseys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Kushaj Sethi",
                role: "Jesus",
                image: "",
                bio: "He's Jesus."
              },
              {
                name: "Darshil",
                role: "lauda",
                image: "",
                bio: "lauda"
              },
              {
                name: "Tavam",
                role: "Upi guy",
                image: "",
                bio: "We use his"
              }
            ].map((member, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="glass-card rounded-xl p-6 hover-lift">
                  <div className="relative mb-4 mx-auto w-32 h-32">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-gradient-accent font-medium mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      <EnhancedCartModal
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default About;
