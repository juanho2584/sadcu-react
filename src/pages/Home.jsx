import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Nosotros from "../components/Nosotros";
import Disciplinas from "../components/Disciplinas";
import Instructores from "../components/Instructores";
import Galeria from "../components/Galeria";
import Comentarios from "../components/Comentarios";
import Contacto from "../components/Contacto";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Nosotros />
        <Disciplinas />
        <Instructores />
        <Galeria />
        <Contacto />
        <Comentarios />
      </main>
      <Footer />
    </>
  );
};

export default Home;
