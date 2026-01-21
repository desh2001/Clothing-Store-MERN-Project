import React from "react";
import { motion } from "framer-motion";
import { Target, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-[90px]">

      {/* ===== HEADER ===== */}
      <div className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 py-14 shadow-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 text-center text-white"
        >
          <h1 className="text-3xl md:text-5xl font-bold">
            About Clothing Store
          </h1>
          <p className="mt-4 text-base md:text-lg text-blue-100">
            Your trusted destination for fashion and style
          </p>
        </motion.div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* IMAGE + TEXT */}
        <div className="flex flex-col md:flex-row gap-12 items-center">

          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
            alt="Team"
            className="w-full md:w-1/2 rounded-2xl shadow-xl"
          />

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">
              Who We Are
            </h2>
            <p className="text-slate-700 mb-4 leading-relaxed">
              Clothing Store began as a small boutique and evolved into a
              trusted fashion destination for everyone.
            </p>
            <p className="text-slate-700 leading-relaxed">
              We focus on performance, reliability, and honest pricing with
              dependable after-sales support.
            </p>
          </motion.div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <Stat value="5K+" label="Happy Customers" />
          <Stat value="100%" label="Genuine Parts" />
          <Stat value="10+" label="Years Experience" />
          <Stat value="24/7" label="Support" />
        </div>

        {/* VALUES */}
        <div className="mt-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12"
          >
            Our Core Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Target size={30} />}
              title="Precision"
              desc="Every build is carefully assembled with attention to detail."
            />
            <ValueCard
              icon={<Users size={30} />}
              title="Customer First"
              desc="Honest advice, friendly service, and long-term support."
            />
            <ValueCard
              icon={<Award size={30} />}
              title="Excellence"
              desc="Only trusted brands and high-quality components."
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function ValueCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-indigo-600 text-center"
    >
      <div className="flex justify-center mb-4 text-indigo-600 bg-indigo-50 w-14 h-14 mx-auto rounded-full items-center">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function Stat({ value, label }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 text-center shadow-md"
    >
      <h3 className="text-2xl font-bold text-indigo-600">{value}</h3>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </motion.div>
  );
}
