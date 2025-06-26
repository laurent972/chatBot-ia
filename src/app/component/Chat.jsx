'use client'
import { useMutation, useQuery } from '@tanstack/react-query';
import {React, useState } from 'react'
import axios from 'axios';


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

   const sendChat = async (message) => {
        const { data } = await axios.post('/api/chat', {prompt : message});
        console.log('sendChat response', data);
        return data.response;
    }

   

    const mutation = useMutation({
        mutationFn : sendChat,
    });


    const handleSubmit = async (e) => {
        console.log(message);
        
        e.preventDefault();
        const response = await mutation.mutateAsync(message);
        setMessages([...messages, { message : message, response: response }]);
        setMessage("");
    }

  return (
     <div className="w-full max-w-2xl mx-auto h-[90vh] flex flex-col p-4 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        
      </div>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="mt-4 flex items-center gap-2"
      >
        <textarea
          className="flex-1 border rounded-xl p-3 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          placeholder="Écris ton message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
         {/* {pending ? '...' : 'Envoyer'}  */}
        </button>
      </form>
    </div>
  )
}
