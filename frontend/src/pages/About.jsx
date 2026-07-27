import { useNavigate } from "react-router-dom";
import "./About.css";
import { FaCheckCircle, FaUsers, FaBox, FaGlobeAsia } from "react-icons/fa";

function About() {
  const navigate = useNavigate();

  return (
    <section className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <span className="about-badge">About Us</span>
          <h1>Where Style Meets <span className="text-accent">Excellence</span></h1>
          <p>Curated fashion for those who appreciate quality, craftsmanship, and timeless design.</p>
        </div>
      </div>

      <div className="about-story">
        <div className="about-story-img">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
            alt="Elite Attire"
          />
        </div>
        <div className="about-story-content">
          <span className="about-label">Our Story</span>
          <h2>Crafted For Those Who Love Luxury</h2>
          <div className="about-divider" />
          <p>
            At Elite Attire, fashion is more than clothing—it's confidence,
            elegance and timeless style. Every collection is carefully curated
            using premium fabrics and modern craftsmanship to help you stand out
            effortlessly.
          </p>

          <div className="about-features">
            <div className="about-feature"><FaCheckCircle className="af-icon" /> Premium Quality</div>
            <div className="about-feature"><FaCheckCircle className="af-icon" /> Sustainable Fashion</div>
            <div className="about-feature"><FaCheckCircle className="af-icon" /> Modern Designs</div>
          </div>
        </div>
      </div>

      <div className="about-stats">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h3>50K+</h3>
          <span>Happy Customers</span>
        </div>
        <div className="stat-card">
          <FaBox className="stat-icon" />
          <h3>200+</h3>
          <span>Premium Products</span>
        </div>
        <div className="stat-card">
          <FaGlobeAsia className="stat-icon" />
          <h3>15+</h3>
          <span>Countries Served</span>
        </div>
      </div>

      <div className="about-cta">
        <h2>Ready to Elevate Your Wardrobe?</h2>
        <button onClick={() => navigate("/products")}>Explore Collection →</button>
      </div>
    </section>
  );
}

export default About;
