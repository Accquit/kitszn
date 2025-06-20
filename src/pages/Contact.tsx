
import React from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedCartModal from "@/components/EnhancedCartModal";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { cart, handleUpdateQty, handleRemoveFromCart } = useCart();
  const [cartOpen, setCartOpen] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you within 24 hours.",
      duration: 3000,
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cart={cart} onCartClick={() => setCartOpen(true)} />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 py-12">
            <h1 className="text-5xl font-bold font-['Space_Grotesk'] text-gradient mb-4 animate-fade-in">Get In Touch</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Have questions about our jerseys? Need help with sizing? We're here to help you find the perfect fit.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-gradient mb-6 font-['Space_Grotesk']">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-gray-300">support@jerseytown.com</p>
                      <p className="text-gray-300">sales@jerseytown.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Phone</h3>
                      <p className="text-gray-300">+91 1234567890</p>
                      <p className="text-gray-300">+91 1234567890</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Address</h3>
                      <p className="text-gray-300">Street 123</p>
                      <p className="text-gray-300">Bihar</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Business Hours</h3>
                      <p className="text-gray-300">Mon - Fri: 9:00 AM - 8:00 PM</p>
                      <p className="text-gray-300">Sat - Sun: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-2xl font-bold text-gradient mb-6 font-['Space_Grotesk']">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-input border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-input border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    >
                      <option value="" className="bg-gray-800">Select a subject</option>
                      <option value="general" className="bg-gray-800">General Inquiry</option>
                      <option value="sizing" className="bg-gray-800">Sizing Help</option>
                      <option value="order" className="bg-gray-800">Order Status</option>
                      <option value="return" className="bg-gray-800">Returns & Exchanges</option>
                      <option value="authentication" className="bg-gray-800">Authentication Question</option>
                      <option value="wholesale" className="bg-gray-800">Wholesale Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#cc73f8] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#b85df0] transition-all duration-300 flex items-center justify-center space-x-2 group hover:scale-105"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gradient mb-4 font-['Space_Grotesk']">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-300">Quick answers to common questions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "How do I know my jersey is authentic?",
                  answer: "Every jersey comes with a certificate of authenticity and unique hologram. Our expert team verifies each piece before shipping."
                },
                {
                  question: "What's your return policy?",
                  answer: "We offer 30-day returns for unworn items in original packaging. Custom jerseys are final sale unless defective."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes! We ship worldwide. International shipping rates and delivery times vary by location."
                },
                {
                  question: "Can I get a jersey customized?",
                  answer: "Absolutely! We offer custom names and numbers on most jerseys. Contact us for pricing and availability."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="glass-card rounded-xl p-6 animate-fade-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

export default Contact;
