import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-4 rounded-lg z-10">
        <div className="text-right mb-4">
          <button onClick={onClose} className="text-black font-semibold hover:text-gray-700 focus:outline-none">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
