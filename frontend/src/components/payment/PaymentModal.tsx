import React, { useState, useEffect } from 'react';
import { X, QrCode } from 'lucide-react';

export function PaymentModal({ isOpen, onClose, courseTitle, price }: { isOpen: boolean, onClose: () => void, courseTitle: string, price: string }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate fake QR generation delay
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white z-10">
          <X className="w-6 h-6" />
        </button>

        {/* Order Details (Left) */}
        <div className="w-full md:w-1/2 p-8 bg-neutral-800/80 border-r border-neutral-700 flex flex-col">
          <h2 className="text-2xl font-outfit font-bold mb-6 text-white">Order Summary</h2>
          
          <div className="flex-1">
            <div className="bg-neutral-900 rounded-xl p-4 mb-4">
              <span className="text-neutral-400 text-sm">Course</span>
              <p className="text-lg font-semibold text-white mt-1">{courseTitle}</p>
            </div>
            
            <div className="bg-neutral-900 rounded-xl p-4 mb-6">
              <span className="text-neutral-400 text-sm">Total to Pay</span>
              <p className="text-2xl font-bold text-emerald-500 mt-1">{price} VND</p>
            </div>
            
            <p className="text-sm text-neutral-400 flex items-center gap-2">
              <QrCode className="w-4 h-4" /> Please use your MoMo app to scan the QR code.
            </p>
          </div>
        </div>

        {/* QR Code Section (Right) */}
        <div className="w-full md:w-1/2 p-8 bg-neutral-900 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold text-white mb-6">Scan QR to Pay</h3>
          
          <div className="w-48 h-48 bg-white rounded-xl p-2 flex items-center justify-center relative overflow-hidden mb-6">
            {loading ? (
              <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
                <span className="text-neutral-400 text-sm">Loading QR...</span>
              </div>
            ) : (
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MoMoFakePayment" alt="MoMo QR" className="w-full h-full object-contain" />
            )}
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg inline-flex items-center gap-2 text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-outfit font-bold tracking-widest">09:59</span>
          </div>
          <p className="text-xs text-neutral-500 mt-3">Code expires in 10 minutes</p>
        </div>

      </div>
    </div>
  );
}
