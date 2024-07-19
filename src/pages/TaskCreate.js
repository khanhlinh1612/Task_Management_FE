import React from 'react';
import { Modal, Select} from 'antd';
import moment from 'moment';

const { Option } = Select;

const TaskCreate = ({ showCreateForm, handleChange, handleCancel, handlesubmit }) => {
  return (
    <Modal open={showCreateForm} onCancel={handleCancel} footer={null}>
        <form className="create-task-form" onSubmit={handleSubmit}>
          <h2>Create New Task</h2>
          <label>
            Title:
            <input type="text" name="title" value={newTask.title} onChange={handleChange} required />
          </label>
          <label>
            Description:
            <textarea name="description" value={newTask.description} onChange={handleChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={newTask.status} onChange={handleChange} required>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </label>
          <label>
            Due Date:
            <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleChange} required />
          </label>
          <button type="submit">Add Task</button>
        </form>
      </Modal>
  );
};

export default TaskCreate;
