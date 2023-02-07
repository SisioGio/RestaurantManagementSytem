// client/src/App.js

import moment from "moment";
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
// Shows products of a selected order
function UserTicketForm(props) {
  const [formVisible, setFormVisibility] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const dispatch = dispatchFeedbackContexts();

  function handleChange(event) {
    const { value, name } = event.target;
    setForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  return (
    !apiService.isAdmin() && (
      <div className="personal-data">
        <a
          href="#"
          className={
            formVisible
              ? "ticket-form-toggle bg-red"
              : "ticket-form-toggle bg-green"
          }
          onClick={() => setFormVisibility(!formVisible)}
        >
          {formVisible ? "Close Form" : "Create a new ticket"}
        </a>
        <div className="user-data-title">Create a new ticket</div>
        {formVisible && (
          <div className="ticket-form">
            <div className="ticket-item">
              <label htmlFor="">Subject</label>
              <input
                type="text"
                name="subject"
                onChange={handleChange}
                value={form.subject}
              />
            </div>

            <div className="ticket-item">
              <label htmlFor="">Message</label>
              <textarea
                rows={5}
                name="message"
                onChange={handleChange}
                value={form.message}
              />
              <svg
                className="top-right"
                onClick={() => props.saveTicket(form)}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default UserTicketForm;
