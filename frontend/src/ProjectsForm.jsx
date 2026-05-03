import { SketchPicker } from "react-color";

function ProjectsForm({
  setColor,
  color,
  handleSubmitProjectSearch,
  projectname,
  setProjectname,
  projectdescription,
  setProjectdescription
}) {
  return (
    <section className="project-form-card">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Create</p>
          <h2>Create Your Project</h2>
        </div>
      </div>

      <form onSubmit={handleSubmitProjectSearch}>
        <input
          type="text"
          placeholder="Project name"
          value={projectname}
          onChange={(e) => setProjectname(e.target.value)}
        />

        <input
          type="text"
          placeholder="Project description"
          value={projectdescription}
          onChange={(e) => setProjectdescription(e.target.value)}
        />

        <div className="picker-wrap">
          <SketchPicker
            color={color}
            onChange={(updatedColor) => setColor(updatedColor.hex)}
          />

          <div className="selected-color-card">
            <span style={{ background: color }} />
            <p>Selected: {color}</p>
          </div>
        </div>

        <button type="submit">Post Project</button>
      </form>
    </section>
  );
}

export default ProjectsForm;
