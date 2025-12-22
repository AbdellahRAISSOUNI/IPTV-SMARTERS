"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    text: "Best IPTV service I've ever used! Crystal clear quality and never buffers. The support team is amazing too.",
    name: "Ahmed M.",
    username: "@ahmedstreams",
    location: "New York, USA"
  },
  {
    text: "I've been using this service for 6 months now. The channel selection is incredible and the price is unbeatable.",
    name: "Sarah K.",
    username: "@sarahtv",
    location: "London, UK"
  },
  {
    text: "Perfect for watching sports! All the channels I need are here and the quality is outstanding. Highly recommended!",
    name: "Mohammed R.",
    username: "@mohammediptv",
    location: "Dubai, UAE"
  },
  {
    text: "Switched from cable TV and never looked back. This service is way better and much cheaper. Love it!",
    name: "Emma L.",
    username: "@emmacordcutter",
    location: "Toronto, Canada"
  },
  {
    text: "The 50,000+ channels are insane! I can watch everything from anywhere in the world. Best investment ever.",
    name: "David T.",
    username: "@davidtvpro",
    location: "Paris, France"
  },
  {
    text: "No more freezing or buffering issues. The anti-freezing technology really works. Super satisfied!",
    name: "Maria G.",
    username: "@mariastreams",
    location: "Madrid, Spain"
  },
  {
    text: "The VOD library is huge! 70,000+ movies and series. I'm never running out of things to watch.",
    name: "John P.",
    username: "@johnbinge",
    location: "Sydney, Australia"
  },
  {
    text: "24/7 support actually responds instantly. They helped me set up on my Smart TV in minutes.",
    name: "Lisa W.",
    username: "@lisaiptv",
    location: "Berlin, Germany"
  },
  {
    text: "Works perfectly on all my devices. Smart TV, phone, tablet - seamless streaming everywhere!",
    name: "Alex B.",
    username: "@alexmultidevice",
    location: "Tokyo, Japan"
  }
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

interface TestimonialsColumnProps {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}

const TestimonialsColumn = ({ className, testimonials, duration = 10 }: TestimonialsColumnProps) => {
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <div 
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div 
        animate={{
          translateY: isPaused ? undefined : "-50%",
        }}
        transition={{
          duration: duration,
          repeat: isPaused ? 0 : Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, name, location }, testimonialIndex) => (
            <motion.div 
              key={testimonialIndex} 
              className="p-5 rounded-2xl border border-[#e5e7eb] bg-white/80 backdrop-blur-sm hover:border-[#2563eb]/30 transition-all duration-500 group shadow-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="mb-4">
                <motion.div 
                  className="flex mb-3"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#2563eb] text-[#2563eb] transition-all duration-300" />
                  ))}
                </motion.div>
                <p className="text-[#1a1a1a] leading-relaxed text-sm">&ldquo;{text}&rdquo;</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb]/30">
                <div className="flex flex-col">
                  <div className="font-semibold text-[#1a1a1a] tracking-tight leading-5 text-sm">
                    {name}
                  </div>
                  <div className="text-xs text-[#1a1a1a]/60 leading-4 tracking-tight">{location}</div>
                </div>
                <motion.div 
                  className="text-xs font-bold px-2.5 py-1 rounded-full border group-hover:shadow-lg transition-all duration-300" 
                  style={{ 
                    color: '#2563eb', 
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)'
                  }}
                  whileHover={{ 
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    scale: 1.05
                  }}
                  transition={{ duration: 0.2 }}
                >
                  5 Stars
                </motion.div>
              </div>
            </motion.div>
          ))}
        </React.Fragment>
      ))}
      </motion.div>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-12 lg:py-20 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#1a1a1a]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
          >
            What Our <span className="text-[#2563eb]">Customers</span> Say
          </motion.h2>
          <motion.p 
            className="text-[#1a1a1a]/70 text-lg max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            From crystal clear quality to incredible channel selection, discover how our IPTV service has transformed the viewing experience for customers worldwide.
          </motion.p>
        </motion.div>

        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
        >
          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)] max-h-[600px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={20} />
            <TestimonialsColumn
              testimonials={secondColumn}
              className="hidden md:block"
              duration={25}
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              className="hidden lg:block"
              duration={22}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

