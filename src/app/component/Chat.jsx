'use client'
import { useMutation, useQuery } from '@tanstack/react-query';
import {React, useEffect, useState } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState('')

    useEffect(() => {
    let storedId = localStorage.getItem('chat-session-id');
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('chat-session-id', storedId);
    }
    setSessionId(storedId);
    }, []);

   useEffect(() => {
      if (!sessionId) return;

      const fetchMessages = async () => {
        const { data } = await axios.get(`/api/chat?sessionId=${sessionId}`);
        setMessages(data.messages || []);
      };

      fetchMessages();
    }, [sessionId]);

   const sendChat = async (message) => {
        const { data } = await axios.post('/api/chat', {prompt : message, sessionId: sessionId });
        console.log('sendChat response', data.data);
        return data.data;
    }

    const { mutateAsync, isPending, isError, error } = useMutation({
        mutationFn: sendChat,
      });


    const handleSubmit = async (e) => {
        console.log(message);
            e.preventDefault();
            if (!message.trim()) return;

            const userMessage = { role: 'user', content: message };
            setMessages((prev) => [...prev, userMessage]);
            setMessage('');

        try {
          const assistantMessage = await mutateAsync(message);
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: assistantMessage },
          ]);
        } catch (err) {
          console.error('Erreur lors de l’envoi du message', err);
        }
    }

   console.log(messages);
   

  return (
     <div className="w-full max-w-2xl mx-auto h-[90vh] flex flex-col p-4 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        <ul>
        {messages.map((message,index, role)=>{
            return( 
            
              <li key={index}>
                {message.role === 'user' &&  <p><strong>👤 Toi :</strong> {message.content}</p>}
                
                 {message.role === 'assistant' &&  <p><strong>🤖 Assistant :</strong> {message.content}</p>} 
                 
              
              </li>
            
           )
        })}
        </ul>
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
         { isPending ?
          <svg width="30" height="30" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="none" stroke="#ffffff" stroke-width="4"><animate attributeName="r" from="20" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"></animate><animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"></animate></circle></svg>
          : 'Envoyer'}
        </button>
      </form>
    </div>
  )
}
