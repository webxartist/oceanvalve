"use client";

import { Phone, MessageCircle } from "lucide-react";

const PHONE_NUMBER = "919820800306";

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-24 right-5 z-[9999] flex flex-col gap-3">
      {/* Call Button */}
      <a
        href={`tel:+${PHONE_NUMBER}`}
        aria-label="Call us"
        title="Call us"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-blue-700"
      >
        <Phone size={25} />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${PHONE_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="WhatsApp us"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-green-600"
      >
        <MessageCircle size={27} />
      </a>
    </div>
  );
}
