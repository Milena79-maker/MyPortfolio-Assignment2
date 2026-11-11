
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/projects";

export default function ProjectManager({ session }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    completionDate: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const isAdmin = session?.user?.role === "admin";

  async function loadProjects() {
    setLoading(true);

    try {
      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load projects");
      }

      setProjects(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function saveProject(e) {
    e.preventDefault();

    if (!isAdmin) {
      setMessage("Admin access required.");
      return;
    }

    setMessage("");

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save project");
      }

      setMessage(
        editingId
          ? "Project updated successfully!"
          : "Project created successfully!"
      );

      setForm({
        title: "",
        description: "",
        completionDate: ""
      });
      setEditingId(null);
      await loadProjects();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editProject(project) {
    setEditingId(project._id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      completionDate: project.completionDate
        ? project.completionDate.substring(0, 10)
        : ""
    });
  }

  async function deleteProject(id) {
    if (!isAdmin) return;
    if (!window.confirm("Delete this project?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete project");
      }

      setMessage("Project deleted successfully!");
      await loadProjects();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section id="manage-projects">
      <h2>Portfolio Projects</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div>
          {projects.length === 0 && <p>No projects found.</p>}

          {projects.map((project) => (
            <div className="project-card" key={project._id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {project.completionDate && (
                <p>
                  Completed:{" "}
                  {new Date(
                    project.completionDate
                  ).toLocaleDateString()}
                </p>
              )}

              {isAdmin && (
                <div>
                  <button
                    type="button"
                    onClick={() => editProject(project)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProject(project._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <form onSubmit={saveProject}>
          <h3>{editingId ? "Edit Project" : "Add Project"}</h3>

          <label htmlFor="project-title">Project Title</label>
          <input
            id="project-title"
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <label htmlFor="project-description">
            Description
          </label>
          <textarea
            id="project-description"
            required
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <label htmlFor="project-date">
            Completion Date
          </label>
          <input
            id="project-date"
            type="date"
            required
            value={form.completionDate}
            onChange={(e) =>
              setForm({
                ...form,
                completionDate: e.target.value
              })
            }
          />

          <button type="submit">
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </form>
      )}

      <p role="status">{message}</p>
    </section>
  );
}