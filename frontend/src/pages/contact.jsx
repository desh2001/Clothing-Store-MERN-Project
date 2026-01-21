import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function GoogleMap() {
  return (
    <iframe
      title="Google Map"
      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d159671.72085921193!2d79.90558803394127!3d6.966730155869426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1766566431116!5m2!1sen!2slk"
      className="w-full h-full rounded-xl border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function sendMessage() {
    console.log("Sending message:", { firstName, lastName, email, phone, message });
    if (!firstName || !lastName || !email || !message) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/users/sendmail/",
        {
          email,
          subject: `Contact Form: ${firstName} ${lastName}`,
          message,
          phone,
        }
      );
      toast.success("Message sent successfully");

      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-[60px] pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
            Get in Touch
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Have a question or need support? Our team is ready to help you.
          </p>
        </motion.div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
          {/* ===== CONTACT INFO ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col justify-between w-full lg:w-2/5"
          >
            <div>
              <h2 className="text-3xl font-bold mb-3">Contact Information</h2>
              <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                Fill out the form and we'll respond within 24 hours.
              </p>

              <div className="space-y-6">
                <InfoItem icon={<Phone size={24} />} text="+94 77 123 4567" />
                <InfoItem icon={<Mail size={24} />} text="support@clothingstore.com" />
                <InfoItem icon={<MapPin size={24} />} text="Colombo, Sri Lanka" />
              </div>
            </div>

            {/* Map */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-8 h-56 md:h-64 rounded-xl overflow-hidden shadow-md"
            >
              <GoogleMap />
            </motion.div>
          </motion.div>

          {/* ===== CONTACT FORM ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col justify-start w-full lg:w-2/5 h-[650px] overflow-y-auto"
          >
            <form
              className="w-full space-y-5 relative z-10"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
                console.log("Form submitted");
              }}
            >
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition text-slate-700"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition text-slate-700"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition text-slate-700"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition text-slate-700"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition text-slate-700"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition"
              >
                Send Message <Send size={20} />
              </motion.button>
            </form>
          </motion.div>

          {/* ===== ENVELOPE ANIMATION FULL HEIGHT ===== */}
          <motion.div
            className="w-full lg:w-1/5 relative overflow-hidden"
            style={{ height: "650px" }}
          >
            <motion.div
              animate={{
                y: [0, -550, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-xl shadow-xl flex items-center justify-center"
            >
              <Mail size={32} className="text-blue-600" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */
function InfoItem({ icon, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white/15 rounded-lg text-blue-200 flex-shrink-0">{icon}</div>
      <span className="text-base text-blue-50 font-medium mt-0.5">{text}</span>
    </div>
  );
}
