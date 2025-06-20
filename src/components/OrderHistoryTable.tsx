
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingBag } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface OrderHistoryTableProps {
  orders: Tables<'orders'>[];
}

const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({ orders }) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-white">No orders found</h3>
        <p className="mt-1 text-sm text-gray-400">You haven't placed any orders yet.</p>
        <div className="mt-6">
           <Button onClick={() => navigate('/shop')} className="bg-[#cc73f8] hover:bg-[#b85df0]">
                Start Shopping
            </Button>
        </div>
      </div>
    );
  }

  const formatOrderId = (id: string) => `JT-${id.split('-')[0].toUpperCase()}`;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-800/50">
            <TableHead className="text-gray-300">Order</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-right text-gray-300">Total</TableHead>
            <TableHead className="text-center text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-gray-800 hover:bg-gray-800/50">
              <TableCell className="font-medium">{formatOrderId(order.id)}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'Completed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {order.status}
                </span>
              </TableCell>
              <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/order-details/${order.id}`)} className="hover:bg-gray-700">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderHistoryTable;
