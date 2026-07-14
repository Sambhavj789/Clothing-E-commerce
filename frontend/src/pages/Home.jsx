import "./Home.css";
import hero1 from "../assets/image.png";
import hero2 from "../assets/image3.png";

const slides = [
  {
    id: 1,
    image: hero1,
    title: "Modern Furniture Collection",
    subtitle:
      "Transform your home with premium quality furniture crafted for comfort and style.",
    button: "Explore Collection",
  },
  {
    id: 2,
    image: hero2,
    title: "Luxury Interior Designs",
    subtitle:
      "Discover elegant designs that bring beauty and functionality to every room.",
    button: "Shop Now",
  },
];

function Home() {
  return (
    <section className="home-section">
      <div className="hero-slider">
        {slides.map((slide) => (
          <div className="hero-slide" key={slide.id}>
            <img src={slide.image} alt={slide.title} />

            <div className="hero-overlay"></div>

            <div className="hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>

              <button>{slide.button}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Home;