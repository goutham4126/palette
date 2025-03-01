"use client";

import { useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

const RazorpayPayment = ({ amount, productName,creator }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  console.log(creator)

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 })
      });

      if (!res.ok) throw new Error('Failed to create order');
      
      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Pallette",
        description: `Purchase of ${productName}`,
        order_id: data.orderId,
        handler: function (response) {
          console.log('Payment successful:', response);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9160804126"
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: () => setIsProcessing(false)
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
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
        disabled={isProcessing}
        size="lg"
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Purchase Now
          </>
        )}
      </Button>
    </>
  );
};

export default RazorpayPayment;