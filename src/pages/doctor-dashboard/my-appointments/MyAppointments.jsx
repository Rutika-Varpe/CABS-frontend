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

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
     <div className="slogan-container">
      <h1>Stay on Track with Your Health – Your Appointments, Simplified!</h1>
    </div>
      {appointments.length === 0 ? (
        <p className="no-appointments">No appointments booked yet.</p>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appt) => (
            <div className="appointment-card" key={appt.id}>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
