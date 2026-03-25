import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Trash2, CheckCircle, Clock, Truck, Package, XCircle, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { userInfo } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL || '';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/api/orders`, config);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  const updateStatus = async (id, status) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`${API_URL}/api/orders/${id}/status`, { status }, config);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const markAsPaid = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`${API_URL}/api/orders/${id}/pay`, {}, config);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, isPaid: true, paidAt: new Date() }));
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`${API_URL}/api/orders/${id}`, config);
        setOrders(orders.filter(o => o._id !== id));
        if (selectedOrder && selectedOrder._id === id) setSelectedOrder(null);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={14} className="mr-1" />;
      case 'Processing': return <Package size={14} className="mr-1" />;
      case 'Shipped': return <Truck size={14} className="mr-1" />;
      case 'Delivered': return <CheckCircle size={14} className="mr-1" />;
      case 'Cancelled': return <XCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Loading Orders...
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest italic">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-neutral-dark tracking-tighter uppercase italic">
            Order <span className="text-accent-600">Management</span>
          </h1>
          <p className="text-neutral-dark/40 text-xs font-black uppercase tracking-widest mt-1">
            Track and fulfill your masterpiece deliveries
          </p>
        </div>
      </div>

      <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary-100">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Order ID & Date</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Customer</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Total</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Status</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Payment</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-neutral-dark">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] text-neutral-dark/40 font-bold uppercase tracking-widest mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-neutral-dark">{order.shippingAddress.fullName}</p>
                    <p className="text-[10px] text-neutral-dark/40 font-bold uppercase tracking-widest mt-1">
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </p>
                  </td>
                  <td className="px-8 py-6 font-black italic text-neutral-dark flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    {order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {order.isPaid ? (
                      <div className="inline-flex items-center text-green-600 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle size={12} className="mr-1" /> Paid
                      </div>
                    ) : (
                      <div className="inline-flex items-center text-amber-600 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} className="mr-1" /> Pending
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 bg-white text-accent-400 border border-primary-100 rounded-xl hover:text-accent-600 hover:border-accent-200 transition-all shadow-sm"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="p-3 bg-white text-red-400 border border-primary-100 rounded-xl hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                        title="Delete Order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-neutral-dark/40 font-black uppercase tracking-widest italic">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-neutral-dark/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] border border-primary-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-neutral-dark">
                    Order <span className="text-accent-600">Details</span>
                  </h2>
                  <p className="text-neutral-dark/40 text-xs font-black uppercase tracking-widest mt-1">
                    Order ID: {selectedOrder._id}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-4 bg-primary-50 text-neutral-dark/40 rounded-full hover:bg-primary-100 hover:text-neutral-dark transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 mb-4 ml-4">Shipping Information</h3>
                    <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100">
                      <p className="font-bold text-neutral-dark">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-sm text-neutral-dark/60 mt-2">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-sm text-neutral-dark/60">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                      <p className="text-sm text-neutral-dark/60">{selectedOrder.shippingAddress.country}</p>
                      <p className="text-sm font-bold text-accent-600 mt-4">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 mb-4 ml-4">Payment Status</h3>
                    <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-neutral-dark">{selectedOrder.paymentMethod}</p>
                        {selectedOrder.isPaid ? (
                          <p className="text-xs text-green-600 font-bold uppercase tracking-widest mt-1">Paid on {new Date(selectedOrder.paidAt).toLocaleDateString()}</p>
                        ) : (
                          <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mt-1">Payment Pending</p>
                        )}
                      </div>
                      {!selectedOrder.isPaid && (
                        <button 
                          onClick={() => markAsPaid(selectedOrder._id)}
                          className="px-6 py-3 bg-green-600 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 mb-4 ml-4">Order Items</h3>
                    <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100 space-y-4">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-primary-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-neutral-dark line-clamp-1">{item.name}</p>
                            <p className="text-xs text-neutral-dark/40 font-bold italic">{item.qty} x ₹{item.price.toLocaleString()}</p>
                          </div>
                          <p className="font-black italic text-neutral-dark">₹{(item.qty * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-primary-100 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-bold text-neutral-dark/40 uppercase tracking-widest">Subtotal</p>
                          <p className="font-bold text-neutral-dark italic">₹{selectedOrder.itemsPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-bold text-neutral-dark/40 uppercase tracking-widest">Shipping</p>
                          <p className="font-bold text-neutral-dark italic">₹{selectedOrder.shippingPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-primary-100">
                          <p className="text-sm font-black text-neutral-dark uppercase tracking-widest">Total</p>
                          <p className="text-xl font-black text-accent-600 italic">₹{selectedOrder.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <h3 className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 mb-4 ml-4">Update Fulfillment Status</h3>
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedOrder._id, status)}
                    className={`px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all border ${
                      selectedOrder.status === status 
                        ? 'bg-neutral-dark text-white border-neutral-dark' 
                        : 'bg-white text-neutral-dark/40 border-primary-100 hover:border-neutral-dark/20 hover:text-neutral-dark'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;

