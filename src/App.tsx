'use client';

import { useState } from 'react';

import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Toaster from '@/components/toaster';
import Router from '@/router';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-grow-1 d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-5" style={{ overflowY: 'auto', flexGrow: 1 }}>
          <Router />
        </main>
      </div>

      <Toaster />
    </div >
  );
}

export default App;
