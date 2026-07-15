import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { NavBar, Footer, SuccessAnimation } from './components/layout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Page from './pages/Page';
import { useAppContext } from './lib/store';
import { AnimatePresence } from 'motion/react';

function Layout() {
  const { animation, showAnimation } = useAppContext();
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <NavBar />
      <main className="flex-1 w-full pt-24">
        <Outlet />
      </main>
      <Footer />
      <AnimatePresence>
        {animation && (
          <SuccessAnimation 
            type={animation} 
            onComplete={() => showAnimation(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="collection" element={<Collection />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="page/:slug" element={<Page />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
