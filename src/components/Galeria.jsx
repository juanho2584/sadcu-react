import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const CarouselSection = ({ id, title, images }) => (
  <div className="galeria-seccion">
    <div className="galeria-seccion-titulo">{title}</div>
    <div id={id} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {images.length > 0 ? (
          images.map((img, i) => (
            <div
              className={`carousel-item ${i === 0 ? "active" : ""}`}
              key={img.id || i}
            >
              <img
                src={img.url}
                className="d-block w-100"
                alt={img.titulo || title}
              />
            </div>
          ))
        ) : (
          <div className="carousel-item active">
            <div
              className="d-flex justify-content-center align-items-center bg-dark text-white"
              style={{ height: "300px" }}
            >
              Sin imágenes disponibles
            </div>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" />
          </button>
        </>
      )}
    </div>
  </div>
);

const Galeria = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("galeria_imagenes")
        .select("*, categorias_actividades(nombre)");

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (categoryName) => {
    return images.filter(
      (img) => img.categorias_actividades?.nombre === categoryName
    );
  };

  if (loading)
    return <div className="text-center py-5">Cargando galería...</div>;

  return (
    <section id="galeria" className="py-5 bg-light">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title text-center mb-5">Galería</h2>
        <div className="galeria-grid">
          <CarouselSection
            id="carouselEventos"
            title="Eventos"
            images={filterByCategory("Eventos")}
          />
          <CarouselSection
            id="carouselExamenes"
            title="Exámenes"
            images={filterByCategory("Exámenes")}
          />
          <CarouselSection
            id="carouselEntrenamiento"
            title="Entrenamiento"
            images={filterByCategory("Entrenamiento")}
          />
        </div>
      </div>
    </section>
  );
};

export default Galeria;
