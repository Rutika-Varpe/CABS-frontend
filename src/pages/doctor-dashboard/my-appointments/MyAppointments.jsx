import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const res = await axios.get(`http://localhost:5000/api/appointments/appointments/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/appointments/cancel/${id}`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update appointment status locally
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    }
  };

  return (
    <div className="appointments-container">
      <header className="header-section">
        <h1 className="page-title">My Appointments</h1>
        <p className="slogan">Stay on Track with Your Health – Your Appointments, Simplified!</p>
        <p className="slogan-secondary">Managing your appointments is now easier than ever – Scroll, View, and Stay Updated!</p>
      </header>

      <main className="appointments-section">
        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments booked yet.</p>
        ) : (
          <div className="appointments-scroll">
            {appointments.map((appt) => (
              <div className="appointment-card zoom-in" key={appt.id}>
                <div className="appointment-details">
                  <h3>{appt.doctor?.full_name || "N/A"}</h3>
                  <p><strong>Specialization:</strong> {appt.doctor?.specialization || "N/A"}</p>
                </div>
                <div className="appointment-meta">
                  <p><strong>Date:</strong> {appt.appointment_date}</p>
                  <p><strong>Time:</strong> {appt.appointment_time}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </p>
                  {appt.status.toLowerCase() !== "cancelled" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(appt.id)}
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAppointments;
