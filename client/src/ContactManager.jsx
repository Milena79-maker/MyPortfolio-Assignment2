
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/contacts";

export default function ContactManager({ session }) {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = session?.token;
  const isAdmin = session?.user?.role === "admin";

  async function loadContacts() {
    if (!isAdmin || !token) {
      setContacts([]);
      return;
    }

    try {
      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load contacts");
      }

      setContacts(Array.isArray(data) ? data : data.contacts || []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadContacts();
  }, [token, isAdmin]);

  function handleEdit(contact) {
    setEditingId(contact._id);
    setForm({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      contactNumber: contact.contactNumber || "",
      email: contact.email || ""
    });
    setMessage("");
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update contact");
      }

      setEditingId(null);
      setForm({});
      setMessage("Contact updated successfully!");
      await loadContacts();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this contact?")) return;

    setMessage("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete contact");
      }

      setMessage("Contact deleted successfully!");
      await loadContacts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <section style={{ padding: "30px", textAlign: "center" }}>
      <h2>Contact Management (Admin)</h2>

      {message && <p>{message}</p>}

      {contacts.length === 0 && (
        <p>No contact submissions found.</p>
      )}

      {contacts.map((contact) => (
        <div
          key={contact._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "15px auto",
            maxWidth: "600px"
          }}
        >
          <h3>
            {contact.firstName} {contact.lastName}
          </h3>

          <p>Email: {contact.email}</p>
          <p>Phone: {contact.contactNumber}</p>

          <button onClick={() => handleEdit(contact)}>
            Edit
          </button>

          <button onClick={() => handleDelete(contact._id)}>
            Delete
          </button>
        </div>
      ))}

      {editingId && (
        <form onSubmit={handleUpdate}>
          <h3>Edit Contact</h3>

          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            required
          />

          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
            required
          />

          <input
            placeholder="Phone Number"
            value={form.contactNumber}
            onChange={(e) =>
              setForm({ ...form, contactNumber: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Contact"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({});
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </section>
  );
}