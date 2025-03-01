"use client";
import { useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import { addPurchaseOfProjectByUser } from '@/app/actions/purchase';

const RazorpayPayment = ({ amount, productName, creator, templateId,isPurchased }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Validate required fields
      if (!templateId || !amount) {
        throw new Error('Missing required payment information');
      }

      // Create order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { orderId } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Pallette",
        description: `Purchase of ${productName}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            if (response.razorpay_payment_id) {
              const payment = await addPurchaseOfProjectByUser(templateId);
              if (payment.success) {
                alert('Purchase successful!');
                window.location.reload();
              } else {
                alert(payment.error || 'Purchase recording failed');
              }
            }
          } catch (error) {
            console.error('Payment processing error:', error);
            alert(error.message || 'Payment processing failed');
          }
        },
        prefill: {
          name: creator?.name || '',
          email: creator?.email || '',
          contact: "9999999999"
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => setIsProcessing(false)
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      // Add payment failure handler
      paymentObject.on('payment.failed', (response) => {
        console.error('Payment Failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload"
      />
      
      <Button
        onClick={handlePayment}
        disabled={isProcessing || isPurchased}
        size="lg"
        className="w-full"
      >
        {isPurchased ? (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Purchased
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Purchase Now (₹{amount})
          </>
        )}
      </Button>
    </>
  );
};

export default RazorpayPayment;