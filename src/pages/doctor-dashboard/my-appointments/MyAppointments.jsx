import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAppointments.css";
import { BsThreeDotsVertical } from "react-icons/bs";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointments/appointments/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (doctorId, appointmentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/appointments/appointments/${doctorId}/${appointmentId}/status`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Appointment cancelled successfully.");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel the appointment.");
    }
  };

const handleDelete = async (doctorId, appointmentId) => {
  const token = localStorage.getItem("token");
console.log(`**************${appointmentId}*****************`)
  if (!window.confirm("Are you sure you want to delete this appointment?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/appointments/appointments/${doctorId}/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Appointment deleted successfully.");
    fetchAppointments(); // Refresh the list
  } catch (error) {
    console.error("Error deleting appointment:", error);
    alert("Failed to delete the appointment.");
  }
};


  return (
    <div className="appointments-container">
      <header className="header-section">
        <h1 className="page-title">My Appointments</h1>
        <p className="slogan">
          Stay on Track with Your Health – Your Appointments, Simplified!
        </p>
        <p className="slogan-secondary">
          Managing your appointments is now easier than ever – Scroll, View,
          and Stay Updated!
        </p>
      </header>

      <main className="appointments-section">
        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments booked yet.</p>
        ) : (
          <div className="appointments-scroll">
            {appointments.map((appt) => (
              <div className="appointment-card zoom-in" key={appt.id}>
                <div className="card-header">
                  <BsThreeDotsVertical
                    className="options-icon"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === appt.id ? null : appt.id
                      )
                    }
                  />
                  {openDropdownId === appt.id && (
                    <div className="dropdown-menu">
                      <button
                        className="dropdown-item delete"
                        onClick={() => handleDelete(appt.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="appointment-details">
                  <h3>{appt.doctor?.full_name || "N/A"}</h3>
                  <p>
                    <strong>Specialization:</strong>{" "}
                    {appt.doctor?.specialization || "N/A"}
                  </p>
                </div>
                <div className="appointment-meta">
                  <p>
                    <strong>Date:</strong> {appt.appointment_date}
                  </p>
                  <p>
                    <strong>Time:</strong> {appt.appointment_time}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </p>
                  {appt.status.toLowerCase() !== "cancelled" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(appt.doctor_id, appt.id)}
                    >
                      Cancel
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
