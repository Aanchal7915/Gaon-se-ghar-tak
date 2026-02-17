// import React from 'react';

// const ContactPage = () => {
//   const whatsappNumber = '919728268800'; // India's country code (91) + phone number

//   return (
//     <div className="container mx-auto p-8 lg:p-16">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Contact Us</h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           We'd love to hear from you! Whether you have a question about our products, need help with an order, or just want to say hello, we're here to help. Feel free to visit our store or reach out to us directly.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Contact Information Section */}
//         <div className="bg-white p-8 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Details</h2>
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">Address</h3>
//               <p className="text-gray-600">
//                 Gandhi Shopping Complex<br />
//                 94D, Delhi Rd, Model Town<br />
//                 Rohtak, Haryana 124001
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">Phone</h3>
//               <a href="tel:+919728268800" className="text-blue-600 hover:underline">
//                 097282 68800
//               </a>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">Hours</h3>
//               <p className="text-gray-600"> Closes 9 pm</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">WhatsApp</h3>
//               <a
//                 href={`https://wa.me/${whatsappNumber}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-green-600 hover:underline"
//               >
//                 Send us a message on WhatsApp
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Embedded Map Section */}
//         <div className="bg-white p-2 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Us</h2>
//           <div className="rounded-lg overflow-hidden">
//             {/* The iframe provided by the user */}
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.100913506757!2d76.5878482!3d28.8927891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390da57f02d4f3b7%3A0x6334a171d9f0412e!2sGandhi%20Shopping%20Complex!5e0!3m2!1sen!2sin!4v1672345678901!5m2!1sen!2sin"
//               width="100%"
//               height="450"
//               style={{ border: 0 }}
//               allowFullScreen=""
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactPage;

import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaWhatsapp } from "react-icons/fa";

const ContactPage = () => {
  const whatsappNumber = "919728268800";

  return (
    <div className="container mx-auto p-8 lg:p-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our
          products, need help with an order, or just want to say hello, we're
          here to help.
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Details</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-indigo-600 text-xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">
                  Gandhi Shopping Complex <br />
                  94D, Delhi Rd, Model Town <br />
                  Rohtak, Haryana 124001
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaPhoneAlt className="text-indigo-600 text-xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Phone</h3>
                <a
                  href="tel:+919728268800"
                  className="text-blue-600 hover:underline"
                >
                  097282 68800
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaClock className="text-indigo-600 text-xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Hours</h3>
                <p className="text-gray-600">Closes 9 pm</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaWhatsapp className="text-green-600 text-xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">WhatsApp</h3>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  Send us a message on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-4 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Us</h2>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.100913506757!2d76.5878482!3d28.8927891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390da57f02d4f3b7%3A0x6334a171d9f0412e!2sGandhi%20Shopping%20Complex!5e0!3m2!1sen!2sin!4v1672345678901!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
