import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Table, Select, Popconfirm, message, Tag, Input } from 'antd';
import axios from 'axios';
import { format, parseISO, compareAsc } from 'date-fns';
import '../assets/Dashboard.css';
import 'boxicons';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const { Option } = Select;

const STATUS_STATE = {
  TODO: 'TODO',
  INPROCESS: 'INPROCESS',
  COMPLETED: 'COMPLETED',
};

const Dashboard = () => {
  const { userInfo } = useContext(UserContext);
  const { Search } = Input;
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: STATUS_STATE.TODO,
    dueDate: ''
  });

  const handleCancel = () => {
    setShowForm(false);
    setCurrentTask(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchTasks(userInfo.id);
    }
  }, [userInfo]);

  const fetchTasks = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/${userId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    filterTasks();
    // eslint-disable-next-line
  }, [statusFilter, searchTerm, tasks]);

  const filterTasks = () => {
    let filtered = tasks;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredTasks(filtered);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCreateTask = () => {
    setNewTask({ title: '', description: '', status: STATUS_STATE.TODO, dueDate: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate ? format(parseISO(task.dueDate), 'yyyy-MM-dd') : '' // Convert date for input
    });
    setCurrentTask(task);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedDueDate = newTask.dueDate ? format(new Date(newTask.dueDate), 'yyyy-MM-dd') : '';

      if (isEditing) {
        await axios.patch(`http://localhost:8080/${userInfo.id}/tasks/${currentTask.id}`, { ...newTask, dueDate: formattedDueDate });
        setTasks(tasks.map(task => (task.id === currentTask.id ? { ...task, ...newTask, dueDate: formattedDueDate } : task)));
        message.success('Task updated successfully');
      } else {
        const response = await axios.post(`http://localhost:8080/${userInfo.id}/tasks`, { ...newTask, dueDate: formattedDueDate });
        const createdTask = {
          id: response.data.id,
          userId: userInfo.id,
          ...newTask,
          dueDate: formattedDueDate
        };
        setTasks([...tasks, createdTask]);
        message.success('Task created successfully');
      }

      setNewTask({ title: '', description: '', status: STATUS_STATE.TODO, dueDate: '' });
      setShowForm(false);
      setCurrentTask(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error handling task:", error);
      message.error(isEditing ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const confirmDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/${userInfo.id}/tasks/${taskId}`);
      fetchTasks(userInfo.id);
      message.success('Delete successful');
    } catch (error) {
      message.error('Delete failed');
      console.error("Delete request failed:", error);
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      align: "center",
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      align: "center",
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: "center",
      key: 'status',
      render: (status) => (
        <span>
          <Tag color={status === STATUS_STATE.COMPLETED ? 'green' : status === STATUS_STATE.TODO ? 'gold' : 'blue'}>
            {status === STATUS_STATE.TODO ? 'To Do' : status === STATUS_STATE.INPROCESS ? 'In Progress' : 'Completed'}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      align: "center",
      key: 'dueDate',
      render: dueDate => dueDate ? format(new Date(dueDate), 'dd/MM/yyyy') : '',
      sorter: (a, b) => compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)),
    },
    {
      title: 'Action',
      key: 'action',
      align: "center",
      render: (text, record) => (
        <span>
          <Link>
            <box-icon name='edit' color='#624DE3' onClick={() => handleEditTask(record)} className="actionIcon me-2"></box-icon>
          </Link>

          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Link>
              <box-icon name='trash' color='#A30D11' className="actionIcon"></box-icon>
            </Link>

          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="main-page">
      <h1 className="page-title">Task Management</h1>
      <div className="summary">
        <div className="summary-item">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>
        <div className="summary-item">
          <h3>Completed Tasks</h3>
          <p>{tasks.filter(task => task.status === STATUS_STATE.COMPLETED).length}</p>
        </div>
        <div className="summary-item">
          <h3>To Do Tasks</h3>
          <p>{tasks.filter(task => task.status === STATUS_STATE.TODO).length}</p>
        </div>
        <div className="summary-item">
          <h3>In Progress Tasks</h3>
          <p>{tasks.filter(task => task.status === STATUS_STATE.INPROCESS).length}</p>
        </div>
      </div>
      <Button className="create-task-button" onClick={handleCreateTask}>Create Task</Button>
      <div className="task-filter">
        <label htmlFor="status">Filter by status: </label>
        <Select id="status" value={statusFilter} onChange={handleStatusChange} className='option-field'>
          <Option value="all">All</Option>
          <Option value={STATUS_STATE.TODO}>To Do</Option>
          <Option value={STATUS_STATE.INPROCESS}>In Progress</Option>
          <Option value={STATUS_STATE.COMPLETED}>Completed</Option>
        </Select>
      </div>

      <Modal open={showForm} onCancel={handleCancel} footer={null}>
        <form className="create-task-form" onSubmit={handleSubmit}>
          <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
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
              <option value={STATUS_STATE.TODO}>To Do</option>
              <option value={STATUS_STATE.INPROCESS}>In Progress</option>
              <option value={STATUS_STATE.COMPLETED}>Completed</option>
            </select>
          </label>
          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">{isEditing ? 'Update Task' : 'Add Task'}</button>
        </form>
      </Modal>
      <Search
        placeholder="Find Task"
        allowClear
        enterButton="Search"
        size="large"
        className="w-50 search-box ms-5"
        onSearch={handleSearch}
      />
      <div className="task-list">
        <Table dataSource={filteredTasks} columns={columns} />
      </div>
    </div>
  );
};

export default Dashboard;
