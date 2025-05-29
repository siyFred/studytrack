import React from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

const Home = () => {
	return (
		<div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-manrope text-slate-900">
          O melhor site para acompanhar seus estudos.
        </h1>
        <p className="mt-4 max-w-xl text-slate-600 font-manrope">
          Organize, acompanhe e marque seus estudos de forma simples e eficaz.
        </p>
        <Button className="mt-8">Começar seus estudos</Button>
      </main>
      <Footer />
    </div>
	);
};

export default Home;