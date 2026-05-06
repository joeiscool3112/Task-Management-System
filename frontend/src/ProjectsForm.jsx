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
    <section id="project-create-section" className="project-form-card">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Create</p>
          <h2>Create Your Project</h2>
        </div>
      </div>

      <form id="project-create-form" className="project-create-form" onSubmit={handleSubmitProjectSearch}>
        <input
          id="project-name-input"
          className="project-form-input project-form-input--name"
          type="text"
          placeholder="Project name"
          value={projectname}
          onChange={(e) => setProjectname(e.target.value)}
        />

        <input
          id="project-description-input"
          className="project-form-input project-form-input--description"
          type="text"
          placeholder="Project description"
          value={projectdescription}
          onChange={(e) => setProjectdescription(e.target.value)}
        />

        <div id="project-color-picker-wrap" className="picker-wrap">
          <SketchPicker
            color={color}
            onChange={(updatedColor) => setColor(updatedColor.hex)}
          />

          <div className="selected-color-card">
            <span style={{ background: color }} />
            <p>Selected: {color}</p>
          </div>
        </div>

        <button id="project-submit-button" className="project-submit-btn" type="submit">Post Project</button>
      </form>
    </section>
  );
}

export default ProjectsForm;
