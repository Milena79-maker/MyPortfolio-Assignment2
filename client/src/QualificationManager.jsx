import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/qualifications";

const emptyForm = {
  title: "",
  completionDate: "",
  description: ""
};

export default function QualificationManager({ session }) {
  const [qualifications, setQualifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = session?.token;
  const isAdmin = session?.user?.role === "admin";

  async function loadQualifications() {
    try {
      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load qualifications");
      }

      setQualifications(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadQualifications();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save qualification");
      }

      setMessage(
        editingId
          ? "Qualification updated successfully!"
          : "Qualification added successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadQualifications();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      completionDate: item.completionDate
        ? item.completionDate.substring(0, 10)
        : "",
      description: item.description || ""
    });
    setMessage("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this qualification?")) return;

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
        throw new Error(data.message || "Unable to delete qualification");
      }

      setMessage("Qualification deleted successfully!");
      await loadQualifications();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section style={{ padding: "30px", textAlign: "center" }}>
      <h2>Qualifications Management</h2>

      {message && <p>{message}</p>}

      {isAdmin && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Qualification Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <input
            type="date"
            value={form.completionDate}
            onChange={(e) =>
              setForm({ ...form, completionDate: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Qualification"
              : "Add Qualification"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <div>
        {qualifications.map((item) => (
          <div
            key={item._id}
            style={{
              margin: "20px auto",
              padding: "15px",
              border: "1px solid #ccc",
              maxWidth: "600px"
            }}
          >
            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <p>
              Completed:{" "}
              {item.completionDate
                ? item.completionDate.substring(0, 10)
                : "N/A"}
            </p>

            {isAdmin && (
              <>
                <button onClick={() => handleEdit(item)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}