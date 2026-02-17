// import React, { useState } from 'react';
// import loaderGif from '../assets/loader.gif';

// const LoadingSpinner = () => {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//         <div
//             className="flex flex-col justify-center items-center w-full min-h-screen bg-transparent p-4 cursor-pointer"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <img
//                 src={loaderGif}
//                 alt="Loading..."
//                 className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 animate-pulse mb-8"
//             />
//             <p
//                 className={`
//                     font-poppins text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center
//                     bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text
//                     transition-opacity duration-500 ease-in-out
//                     ${isHovered ? 'opacity-100' : 'opacity-0'}
//                 `}
//             >
//                 Good things take time. Please wait...
//             </p>
//         </div>
//     );
// };

// export default LoadingSpinner;

import React from "react";
import loaderGif from "../assets/loader.gif";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-4">
      {/* Loader Icon */}
      <img
        src={loaderGif}
        alt="Loading..."
        className="w-28 h-28 md:w-36 md:h-36 animate-pulse mb-4 drop-shadow-md"
      />

      {/* Loading Text */}
      <p className="font-serif text-lg sm:text-xl md:text-2xl text-center leading-snug">
        <span className="block font-semibold bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text">
          Good things take time
        </span>
        <span className="block mt-1 text-gray-600 text-sm sm:text-base">
          Please wait...
        </span>
      </p>
    </div>
  );
};

export default LoadingSpinner;
