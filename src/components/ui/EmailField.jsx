import React from 'react';

function EmailField() {
  return (
    <div>   
        <label className="text-white font-inter text-base">Email</label>
        <input type="email" className="bg-gray-800 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
    </div>
  );
}

export default EmailField;