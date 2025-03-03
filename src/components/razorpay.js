"use client";
import {useState} from 'react';
import Script from 'next/script';

const Razorpay = () => {

  const AMOUNT=500;
  const [isProcesssing,setIsProcessing]=useState(false);

  const handlePayment = async () => {

    setIsProcessing(true);
  try{

    const res = await fetch("/api/create-order", { method: "POST" });
    const data= await res.json();
    console.log(data);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: AMOUNT*100,
      name: "Palette",
      currency: "INR",
      order_id: data.id,
      description: "Thank you for your purchase",
      order_id: data.orderId,
      handler: function (response) {
        console.log(response);
      },
      prefill: {
        name: "Goutham",
        email: "goutham4126@gmail.com",
        contact: "9160804126",
      },
      theme:{
        color: "#3399cc",
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  catch(error){
    console.log(error);
  }
  finally{
    setIsProcessing(false);
  }
  }

  return (
      <span>
        <Script src="https://checkout.razorpay.com/v1/checkout.js"/>
        <button onClick={handlePayment} disabled={isProcesssing} className="bg-blue-500 rounded-md p-2.5  text-white font-semibold text-sm">{isProcesssing ? "Processing" : "Pay Now"}</button>
      </span>
  )

}


export default Razorpay;
