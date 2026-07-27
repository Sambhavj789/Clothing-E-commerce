import { useState } from "react";
import toast from "react-hot-toast";
import "./Contact.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error("All fields are required");
    }
    setSending(true);
    // Simulate send – replace with actual API call when backend is ready
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  }

  return (
    <section className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <span className="contact-badge">Get in Touch</span>
          <h1>We'd Love to <span className="text-accent">Hear</span> From You</h1>
          <p>Have a question, feedback, or just want to say hello? Drop us a message.</p>
        </div>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>Our team is here to help you with any questions about our products or your order.</p>

          <div className="ci-card">
            <div className="ci-icon"><FaMapMarkerAlt /></div>
            <div>
              <h4>Address</h4>
              <p>Hazratganj, Lucknow, Uttar Pradesh</p>
            </div>
          </div>

          <div className="ci-card">
            <div className="ci-icon"><FaPhoneAlt /></div>
            <div>
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="ci-card">
            <div className="ci-icon"><FaEnvelope /></div>
            <div>
              <h4>Email</h4>
              <p>eliteattire@gmail.com</p>
            </div>
          </div>

          <div className="ci-card">
            <div className="ci-icon"><FaClock /></div>
            <div>
              <h4>Working Hours</h4>
              <p>Mon – Sat : 10:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" />
          <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email Address" />
          <textarea name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Write your message..." />
          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
