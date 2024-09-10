"use client"
import React, { useState } from 'react';
import { Resend } from 'resend';

const ContactUs = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contactApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom , prenom , email, message }),
      });

      if (response.ok) {
        setStatus('Message sent successfully');
        setNom('');
        setPrenom('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
      setStatus('Error sending message');
    }
  };


  return (
    <div className="flex items-center justify-center h-[calc(100vh-3.2rem)] bg-grayBg">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 ">Contact Us</h1>
        <form onSubmit={handleSubmit}>

            <div className='flex gap-6'>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              value={nom} 
              onChange={(e) => setNom(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md  outline-none focus:border-white  focus:ring-[1.5px] focus:ring-[#b7eacd] "
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
            <input 
              type="text" 
              value={prenom} 
              onChange={(e) => setPrenom(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md  outline-none focus:border-white  focus:ring-[1.5px] focus:ring-[#b7eacd] "
            />
          </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-white  focus:ring-[1.5px] focus:ring-[#b7eacd]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-white  focus:ring-[1.5px] focus:ring-[#b7eacd]"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 text-sm  bg-[#28B463] text-white rounded-lg hover:bg-[#239d57] outline-none focus:border-white  focus:ring-[1.5px] focus:ring-[#b7eacd]"
          >
            Envoyer le message
          </button>
        </form>
        {status && <p className={`mt-2 text-sm text-center ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
      </div>
    </div>
  );
};

export default ContactUs;
