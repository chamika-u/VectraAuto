import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | VectraAuto Sri Lanka",
  description: "Get in touch with VectraAuto customer support. Direct email on PC and direct phone call on mobile.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container max-w-4xl mx-auto px-4 md:px-8 text-stone-800">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Centered Heading */}
        <div className="text-center mb-10 pb-6 border-b border-stone-200">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 uppercase">
            CONTACT CUSTOMER SUPPORT
          </h1>
          <p className="text-xs text-stone-500 mt-2 font-medium tracking-wide">
            Automotive Help Desk & Inquiries · Colombo, Sri Lanka
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          {/* Card 1: Head Office */}
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Business Address</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                VectraAuto Automobile Parts (Pvt) Ltd<br />
                375/77, Laurie’s Road, Galle Road, Colombo.
              </p>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Contact Hotline</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Direct Contact: <a href="tel:0757260688" className="font-semibold text-stone-800 hover:text-red-600">0757260688</a><br />
                WhatsApp: <a href="https://wa.me/94757260688" className="font-semibold text-stone-800 hover:text-red-600">0757260688</a>
              </p>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Email Department</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Orders & Tracking: <a href="mailto:support@vectraauto.lk" className="font-semibold text-red-600 hover:underline">support@vectraauto.lk</a><br />
                General Inquiries: <a href="mailto:info@vectraauto.lk" className="font-semibold text-red-600 hover:underline">info@vectraauto.lk</a>
              </p>
            </div>
          </div>

          {/* Card 4: Operating Hours */}
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Operating Hours</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Monday – Saturday: 8:30 AM – 5:30 PM<br />
                Sunday & Mercantile Holidays: Closed<br />
                <em>(Online store accepts orders 24/7)</em>
              </p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="p-6 md:p-8 bg-stone-50 border border-stone-200 rounded-2xl">
          <h2 className="text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
            <Send size={18} className="text-red-600" />
            Send an Inquiry
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Our technical support team typically responds within 2 business hours.
          </p>

          <form
            className="space-y-4"
            action="mailto:support@vectraauto.lk"
            method="GET"
            encType="text/plain"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Kasun Fernando"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="0771234567"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Vehicle Make / Model / Year</label>
              <input
                type="text"
                name="vehicle"
                placeholder="e.g. Honda Civic 2020 1.5L Turbo"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Part Inquiry / Message</label>
              <textarea
                name="body"
                rows={4}
                required
                placeholder="Describe the spare part or issue you need assistance with..."
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
            >
              Submit Inquiry
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
