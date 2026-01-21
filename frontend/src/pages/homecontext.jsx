import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Monitor, Laptop, Cpu, Headphones, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Assuming you have AuthContext for logged-in user
// import { AuthContext } from '../context/AuthContext';

export default function HomeContent() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const [reviews, setReviews] = useState([]);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + '/reviews/')
      .then((res) => {
        setReviews(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load reviews', err);
        toast.error('Failed to load reviews');
      });
  }, []);

  return (
    <div className="w-full flex flex-col bg-slate-50 overflow-x-hidden pt-[20px]">

      {/* HERO SECTION */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-6 md:px-12 relative overflow-hidden mb-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-block bg-blue-800/50 px-4 py-1.5 rounded-full text-blue-200 text-sm font-medium border border-blue-700/50">
              🚀 Upgrade Your Fashion Today
            </div>
            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
              Clothing <span className="text-blue-300">Store</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-xl leading-relaxed">
              Experience the latest in fashion. Premium apparel, trendy outfits, and accessories tailored for your style.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-3 transition-colors"
            >
              Browse Store <ArrowRight size={20} />
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center relative"
          >
            <motion.img
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"
              alt="Fashion Hero"
              className="rounded-2xl shadow-2xl border-4 border-blue-400/20 w-full max-w-lg object-cover"
            />
          </motion.div>
        </div>
      </div>





      <div className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-slate-800 mb-10 text-center"
          >
            What Our Customers Say
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
          >
            {reviews.map((r) => (
              <ReviewCard key={r.reviewID} name={r.name} comment={r.comment} rating={r.rating} />
            ))}
          </motion.div>

          {/* SUBMIT REVIEW LINK - Only for logged-in users */}
          {isLoggedIn ? (
            <div className="max-w-3xl mx-auto bg-blue-50 p-6 rounded-2xl shadow-md text-center">
              <h3 className="font-bold text-xl text-slate-800 mb-4">Want to share your experience?</h3>
              <button
                onClick={() => navigate('/reviews/add-page')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <p className="text-center text-slate-600 italic">Please log in to leave a review.</p>
          )}
        </div>
      </div>

      {/* FEATURES */}
      <div className="bg-blue-50 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <Feature icon={<ShieldCheck size={40} className="text-blue-600" />} title="Warranty" desc="Trusted protection." />
          <Feature icon={<Truck size={40} className="text-blue-600" />} title="Fast Delivery" desc="Island-wide shipping." />
          <Feature icon={<Clock size={40} className="text-blue-600" />} title="24/7 Support" desc="We are here to help." />
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---
function CategoryCard({ icon, title }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer group hover:shadow-md transition-all"
    >
      <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <span className="font-semibold text-slate-700">{title}</span>
    </motion.div>
  );
}

function ReviewCard({ name, comment, rating }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-blue-50 p-6 rounded-2xl shadow-md flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
      </div>
      <p className="text-slate-800 italic">&quot;{comment}&quot;</p>
      <h4 className="font-bold text-slate-900">{name}</h4>
    </motion.div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-5 rounded-full shadow-md">{icon}</div>
      <h3 className="font-bold text-xl text-slate-800">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}
