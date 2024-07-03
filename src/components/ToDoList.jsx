import React, { useState, useEffect } from 'react';
import { Input, Button, List, Checkbox, Modal, Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../App.css';


export default function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const jobLocal = JSON.parse(localStorage.getItem('tasks')) || [];
    return jobLocal;
  });
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) {
      message.error('Tên công việc không được để trống.');
      return;
    }
    if (tasks.some(task => task.name === newTask.trim())) {
      message.error('Công việc đã tồn tại.');
      return;
    }
    setTasks([...tasks, { id: Date.now(), name: newTask, completed: false }]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditTask(task);
    setEditTaskName(task.name);
  };

  const cancelEdit = () => {
    setEditTask(null);
    setEditTaskName('');
  };

  const saveEdit = () => {
    if (!editTaskName.trim()) {
      message.error('Tên công việc không được để trống.');
      return;
    }
    if (tasks.some(task => task.name === editTaskName.trim() && task.id !== editTask.id)) {
      message.error('Công việc đã tồn tại.');
      return;
    }
    setTasks(tasks.map(task =>
      task.id === editTask.id ? { ...task, name: editTaskName } : task
    ));
    cancelEdit();
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="app">
      <h1>Danh sách công việc</h1>
      <div className="task-input">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nhập tên công việc"
          onPressEnter={addTask}
        />
        <Button type="primary" onClick={addTask}>Thêm</Button>
      </div>
      <List
        className="task-list"
        bordered
        dataSource={tasks}
        renderItem={task => (
          <List.Item
            actions={[
              <EditOutlined onClick={() => startEdit(task)} />,
              <DeleteOutlined onClick={() => deleteTask(task.id)} />,
            ]}
          >
            <Checkbox
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
           <div style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</div>
          </List.Item>
        )}
      />
      <div className="task-footer">
        Công việc đã hoàn thành: {completedCount} / {tasks.length}
      </div>
      {completedCount === tasks.length && tasks.length > 0 && (
        <div className="all-completed">
          Hoàn thành công việc
        </div>
      )}
      <Modal
        title="Chỉnh sửa công việc"
        visible={editTask !== null}
        onOk={saveEdit}
        onCancel={cancelEdit}
      >
        <Input
          value={editTaskName}
          onChange={(e) => setEditTaskName(e.target.value)}
        />
      </Modal>
    </div>
  );
}
