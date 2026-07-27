import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { FaUserCircle, FaCamera, FaArrowLeft } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const IMAGE_API = "http://localhost:4000/uploads/";
  const [form, setForm] = useState({ name: "", email: "", address: "", contactNumber: "" });
  const [picFile, setPicFile] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        contactNumber: user.contactNumber?.toString() || "",
      });
    }
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePicChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("address", form.address);
      fd.append("contactNumber", form.contactNumber);
      if (picFile) fd.append("profilePic", picFile);

      const response = await api.put("/auth/update", fd);
      if (response.data.success) {
        setUser(response.data.data);
        toast.success("Profile updated!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <section className="profile-page"><p className="profile-loading">Please login to view profile.</p></section>;

  return (
    <section className="profile-page">
      <div className="profile-header">
        <button className="profile-back" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <h1>My Profile</h1>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-pic-section">
          <div className="profile-pic-wrapper">
            {picPreview ? (
              <img src={picPreview} alt="preview" className="profile-pic-preview" />
            ) : user.profilePic ? (
              <img src={IMAGE_API + user.profilePic} alt="profile" className="profile-pic-preview" />
            ) : (
              <FaUserCircle className="profile-pic-placeholder" />
            )}
            <label className="profile-pic-overlay">
              <FaCamera />
              <input type="file" accept="image/*" onChange={handlePicChange} hidden />
            </label>
          </div>
        </div>

        <div className="profile-fields">
          <div className="pf-field">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
          </div>
          <div className="pf-field">
            <label>Email</label>
            <input name="email" value={form.email} disabled />
          </div>
          <div className="pf-field">
            <label>Contact Number</label>
            <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="9876543210" type="tel" />
          </div>
          <div className="pf-field">
            <label>Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="Your address" rows={3} />
          </div>
        </div>

        <button type="submit" className="profile-save-btn" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default Profile;
