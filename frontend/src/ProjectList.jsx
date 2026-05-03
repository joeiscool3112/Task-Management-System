import { SketchPicker } from 'react-color';

function ProjectList({
  projects,
  username,
  selectedProject,
  tasks,
  editingProjectId,
  editProjectName,
  setEditProjectName,
  editProjectDescription,
  setEditProjectDescription,
  editProjectColor,
  setEditProjectColor,
  showTaskForm,
  setShowTaskForm,
  taskName,
  setTaskName,
  taskDescription,
  setTaskDescription,
  taskDueDate,
  setTaskDueDate,
  taskStatus,
  setTaskStatus,
  taskPriority,
  setTaskPriority,
  editingTaskId,
  isOwner,
  openTasks,
  closePopup,
  resetTaskForm,
  startEditProject,
  cancelEditProject,
  handleUpdateProject,
  handleDeleteProject,
  handleCreateTask,
  startEditTask,
  handleUpdateTask,
  handleDeleteTask,
  handleChangeStatus,
}) {
  return (
    <div className="project-list">
      <div className="section-title-row">
        <h2>All Projects</h2>
        <span>{projects.length} project{projects.length === 1 ? '' : 's'}</span>
      </div>

      {projects.length === 0 ? (
        <p className="empty-text">No projects yet. Create your first project above.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-box"
              style={{ borderLeft: `10px solid ${project.color || '#3b82f6'}` }}
              onClick={() => openTasks(project)}
            >
              {editingProjectId === project.id ? (
                <div className="project-edit-panel" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editProjectName}
                    onChange={(e) => setEditProjectName(e.target.value)}
                    placeholder="Project name"
                  />

                  <input
                    type="text"
                    value={editProjectDescription}
                    onChange={(e) => setEditProjectDescription(e.target.value)}
                    placeholder="Project description"
                  />

                  <div className="color-edit-box">
                    <SketchPicker
                      color={editProjectColor}
                      onChange={(updatedColor) => setEditProjectColor(updatedColor.hex)}
                    />
                    <p>Selected: {editProjectColor}</p>
                  </div>

                  <div className="button-row">
                    <button onClick={() => handleUpdateProject(project.id)}>Save</button>
                    <button className="ghost-btn" onClick={cancelEditProject}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="project-content">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </div>

                  <div className="project-author">
                    Uploaded by: <b>{project.username}</b>
                  </div>

                  {project.username === username && (
                    <div className="project-actions">
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditProject(project);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <div className="task-overlay" onClick={closePopup}>
          <div className="task-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>

            <div className="popup-project-top">
              <span
                className="project-dot"
                style={{ background: selectedProject.color || '#3b82f6' }}
              />
              <div>
                <h2>{selectedProject.name}</h2>
                <p>{selectedProject.description}</p>
                <small>Uploaded by: {selectedProject.username}</small>
              </div>
            </div>

            <hr />

            <div className="task-header">
              <div>
                <h3>Tasks</h3>
                <p className="muted-text">
                  {isOwner ? 'You can manage tasks in this project.' : 'View only. This is not your project.'}
                </p>
              </div>

              {isOwner && (
                <button
                  className="add-task-btn"
                  onClick={() => {
                    resetTaskForm();
                    setShowTaskForm(true);
                  }}
                >
                  +
                </button>
              )}
            </div>

            {showTaskForm && isOwner && (
              <form
                className="task-form"
                onSubmit={editingTaskId ? handleUpdateTask : handleCreateTask}
              >
                <input
                  type="text"
                  placeholder="Task name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />

                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />

                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <div className="button-row">
                  <button type="submit">
                    {editingTaskId ? 'Save Task' : 'Create Task'}
                  </button>

                  <button
                    className="ghost-btn"
                    type="button"
                    onClick={() => {
                      resetTaskForm();
                      setShowTaskForm(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="task-list">
              {tasks.length === 0 ? (
                <p className="empty-text">No tasks yet</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className={`task-item status-${task.status || 'todo'}`}>
                    <div className="task-main">
                      <h4>{task.name}</h4>
                      <p>{task.description || 'No description'}</p>
                      <div className="task-meta">
                        <span>Due: {task.due_date ? task.due_date.slice(0, 10) : 'No date'}</span>
                        <span>Priority: {task.priority || 'medium'}</span>
                      </div>
                    </div>

                    <div className="task-status">
                      <b>{task.status || 'todo'}</b>
                    </div>

                    {isOwner && (
                      <div className="task-actions">
                        <select
                          value={task.status || 'todo'}
                          onChange={(e) => handleChangeStatus(task, e.target.value)}
                        >
                          <option value="todo">Todo</option>
                          <option value="inprogress">In Progress</option>
                          <option value="done">Done</option>
                        </select>

                        <button onClick={() => startEditTask(task)}>
                          Edit
                        </button>

                        <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
