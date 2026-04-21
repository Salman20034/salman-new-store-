import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, CreditCard, Truck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Checkout = () => {
  const { cart, clearCart, addOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [orderId, setOrderId] = useState<string>('');
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  React.useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cart.length, step, navigate]);

  if (cart.length === 0 && step !== 3) {
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}`;
      setOrderId(newOrderId);
      await addOrder({
        id: newOrderId,
        date: new Date().toISOString(),
        items: [...cart],
        total,
        status: 'Pending',
        customerName: customerName || 'Guest User',
        customerPhone: customerPhone || 'N/A'
      });
      setStep(3);
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-12 text-center max-w-2xl">
        <div className="w-24 h-24 bg-[#43A047]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#43A047]">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-2">Order Placed Successfully!</h2>
        <p className="text-[#6B6B6B] mb-8">
          Order #{orderId} • Arriving by 6:00 PM
        </p>
        
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 mb-8 text-left">
          <h3 className="font-heading font-bold text-lg mb-6">Order Tracking</h3>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#E0E0E0]"></div>
            
            <div className="flex gap-4 mb-6 relative">
              <div className="w-8 h-8 rounded-full bg-[#43A047] text-white flex items-center justify-center flex-shrink-0 z-10">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div className="font-medium text-[#1A1A1A]">Order Confirmed</div>
                <div className="text-sm text-[#6B6B6B]">We have received your order</div>
              </div>
            </div>
            
            <div className="flex gap-4 mb-6 relative">
              <div className="w-8 h-8 rounded-full bg-[#013220] text-white flex items-center justify-center flex-shrink-0 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              </div>
              <div>
                <div className="font-medium text-[#1A1A1A]">Processing</div>
                <div className="text-sm text-[#6B6B6B]">Your items are being packed</div>
              </div>
            </div>
            
            <div className="flex gap-4 mb-6 relative">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] border-2 border-[#E0E0E0] flex items-center justify-center flex-shrink-0 z-10">
              </div>
              <div>
                <div className="font-medium text-[#6B6B6B]">Out for Delivery</div>
                <div className="text-sm text-[#6B6B6B]">Delivery partner is on the way</div>
              </div>
            </div>
            
            <div className="flex gap-4 relative">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] border-2 border-[#E0E0E0] flex items-center justify-center flex-shrink-0 z-10">
              </div>
              <div>
                <div className="font-medium text-[#6B6B6B]">Delivered</div>
                <div className="text-sm text-[#6B6B6B]">Order delivered to your address</div>
              </div>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-6">
          
          {/* Step 1: Address */}
          <div className={`bg-white rounded-2xl border ${step === 1 ? 'border-[#013220] shadow-md' : 'border-[#E0E0E0] opacity-70'} overflow-hidden transition-all`}>
            <div className="p-4 border-b border-[#E0E0E0] bg-[#F5F5F5] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#013220] text-white flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="font-heading font-bold text-lg">Delivery Address</h2>
            </div>
            
            {step === 1 && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                  <Input label="Phone Number" placeholder="+91 98765 43210" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                </div>
                <Input label="House/Flat No., Building Name" placeholder="123, MK Apartments" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <Input label="Street, Area" placeholder="Main Road, Cheerattamala" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" value="Malappuram" disabled />
                  <Input label="Pincode" value="676505" disabled />
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Preferred Delivery Time</label>
                  <select className="flex h-12 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#013220]/20 focus:border-[#013220]">
                    <option>Today, 4:00 PM - 6:00 PM</option>
                    <option>Today, 6:00 PM - 8:00 PM</option>
                    <option>Tomorrow, 8:00 AM - 10:00 AM</option>
                    <option>Tomorrow, 10:00 AM - 12:00 PM</option>
                  </select>
                </div>

                <Input label="Delivery Instructions (Optional)" placeholder="Leave at the door" />
                
                <div className="pt-4">
                  <Button size="lg" onClick={() => {
                    if (!customerName || !customerPhone || !address) {
                      alert('Please fill in all required fields (Name, Phone, Address)');
                      return;
                    }
                    setStep(2);
                  }}>Continue to Payment</Button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={`bg-white rounded-2xl border ${step === 2 ? 'border-[#013220] shadow-md' : 'border-[#E0E0E0] opacity-70'} overflow-hidden transition-all`}>
            <div className="p-4 border-b border-[#E0E0E0] bg-[#F5F5F5] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#013220] text-white flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="font-heading font-bold text-lg">Payment Method</h2>
            </div>
            
            {step === 2 && (
              <div className="p-6 space-y-4">
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#013220] bg-[#013220]/5' : 'border-[#E0E0E0] hover:bg-[#F5F5F5]'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 accent-[#013220]"
                  />
                  <div className="flex items-center gap-3">
                    <Truck className="text-[#013220]" />
                    <div>
                      <div className="font-medium text-[#1A1A1A]">Cash on Delivery</div>
                      <div className="text-sm text-[#6B6B6B]">Pay when you receive the order</div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-[#013220] bg-[#013220]/5' : 'border-[#E0E0E0] hover:bg-[#F5F5F5]'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="upi" 
                    checked={paymentMethod === 'upi'} 
                    onChange={() => setPaymentMethod('upi')}
                    className="w-5 h-5 accent-[#013220]"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#013220]" />
                    <div>
                      <div className="font-medium text-[#1A1A1A]">UPI (GPay, PhonePe, Paytm)</div>
                      <div className="text-sm text-[#6B6B6B]">Pay instantly via UPI</div>
                    </div>
                  </div>
                </label>
                
                <div className="pt-4 flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)}>Back</Button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sticky top-24">
            <h3 className="font-heading font-bold text-lg mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex gap-2">
                    <span className="text-[#6B6B6B]">{item.quantity}x</span>
                    <span className="text-[#1A1A1A] line-clamp-1">{item.name}</span>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#E0E0E0] pt-4 space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Subtotal</span>
                <span className="text-[#1A1A1A] font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Delivery Charge</span>
                <span className="text-[#1A1A1A] font-medium">
                  {deliveryCharge === 0 ? <span className="text-[#43A047]">Free</span> : formatPrice(deliveryCharge)}
                </span>
              </div>
            </div>
            
            <div className="border-t border-[#E0E0E0] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-lg">Total</span>
                <span className="font-heading font-bold text-2xl text-[#013220]">{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full"
              disabled={step !== 2 || isProcessing}
              isLoading={isProcessing}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
