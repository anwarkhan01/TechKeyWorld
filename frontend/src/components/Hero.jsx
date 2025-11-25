import React from "react";
import {useNavigate} from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[65vh] flex flex-col justify-center items-center text-center px-4 pt-12">
      {/* Subtle badge */}
      <div className="mb-8 md:px-5 md:py-2 px-2 py-2 rounded-full border border-amber-200 bg-amber-50/60 backdrop-blur-sm inline-flex items-center shadow-sm">
        <span className="text-gray-700 font-medium text-sm tracking-wide">
          Fast Digital Delivery | Genuine Software Guaranteed
        </span>
      </div>

      {/* Headline */}
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
        <span className="bg-linear-to-r from-slate-800 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Unlock Premium
        </span>
        <br />
        <span className="text-gray-900">Software Licenses</span>
      </h2>

      {/* Subtitle */}
      <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        Powerful tools for productivity, security, and creativity — delivered
        instantly. Upgrade your digital workspace with verified keys and
        reliable activation support.
      </p>

      {/* Supporting points */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-gray-700 text-sm sm:text-base">
        <div className="px-4 py-2 rounded-lg bg-white shadow-sm border border-amber-100">
          Lifetime & Annual Licenses
        </div>
        <div className="px-4 py-2 rounded-lg bg-white shadow-sm border border-amber-100 md:block hidden">
          Activation Support Included
        </div>
        <div className="px-4 py-2 rounded-lg bg-white shadow-sm border border-amber-100">
          Secure Payments & Trusted Vendors
        </div>
      </div>

      {/* CTA */}
      <button
        className="px-8 py-4 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-yellow-600 transition-all flex items-center gap-2 group"
        onClick={() => navigate("/products")}
      >
        Browse Products
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </button>
    </div>
  );
};

export default Hero;
