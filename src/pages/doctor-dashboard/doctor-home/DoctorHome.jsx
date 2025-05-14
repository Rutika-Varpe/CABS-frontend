import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorHome.css";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching doctor appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh appointments after update
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      console.error("Error updating appointment status", err);
    }
  };

  const totalAppointments = appointments.length;
  const confirmed = appointments.filter(
    (a) => a.status.toLowerCase() === "confirmed"
  ).length;
  const pending = appointments.filter(
    (a) => a.status.toLowerCase() === "pending"
  ).length;

  return (
    <div className="doctor-dashboard">
      <h2 className="dashboard-heading">Welcome, Doctor!</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p>{totalAppointments}</p>
        </div>
        <div className="stat-card confirmed">
          <h3>Confirmed</h3>
          <p>{confirmed}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
      </div>

      <h3 className="upcoming-title">Upcoming Appointments</h3>
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments scheduled.</p>
        ) : (
          appointments.map((appt) => (
            <div className="appointment-card" key={appt.id}>
              <div><strong>Patient:</strong><br />{appt.patient?.full_name || "N/A"}</div>
              <div><strong>Date:</strong><br />{appt.appointment_date}</div>
              <div><strong>Time:</strong><br />{appt.appointment_time}</div>
              <div>
                <strong>Status:</strong><br />
                <span className={`status ${appt.status.toLowerCase()}`}>
                  {appt.status}
                </span>
              </div>

              {appt.status.toLowerCase() === "pending" && (
                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => updateStatus(appt.id, "Confirmed")}
                  >
                    Approve
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => updateStatus(appt.id, "Canceled")}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorHome;
