
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Package, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { cart } = useCart();

    const adminSections = [
        { title: 'Manage Users', icon: Users, description: 'View and manage user accounts.', link: '/admin/users' },
        { title: 'Manage Products', icon: Package, description: 'Add, edit, and remove products.', link: '/admin/products' },
        { title: 'View Orders', icon: BarChart2, description: 'Review customer orders and analytics.', link: '/admin/orders' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header cart={cart} onCartClick={() => {}} />
            <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <h1 className="text-4xl font-bold font-['Space_Grotesk'] text-gradient mb-8">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {adminSections.map(section => (
                        <Link to={section.link} key={section.title} className="outline-none focus-visible:ring-2 focus-visible:ring-[#cc73f8] rounded-lg">
                            <Card className="h-full bg-gray-900/50 backdrop-blur-md border-gray-800/50 hover:border-[#cc73f8] transition-all duration-300 transform hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-semibold text-white">{section.title}</CardTitle>
                                    <section.icon className="h-6 w-6 text-[#cc73f8]" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-400">{section.description}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
