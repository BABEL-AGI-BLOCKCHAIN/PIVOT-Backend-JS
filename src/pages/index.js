import { useEffect, useState } from 'react';
import initEventListeners from '../events/eventListeners.js';

function HomePage() {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    try {
      console.log('Starting the app...');
      initEventListeners();
      setStatus('Event listeners initialized!');
    } catch (error) {
      console.error('Error initializing event listeners:', error);
      setStatus('Error initializing event listeners.');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-green-500">{status}</h1>
    </div>
  );
}

export default HomePage;
