import React, { useState } from 'react';
import styled from 'styled-components';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
`;

const TaskInputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const TaskInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 2px solid #3498db;
  border-radius: 5px;
  font-size: 16px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #2980b9;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  color: #2c3e50;
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TaskText = styled.span`
  flex: 1;
  text-align: left;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #c0392b;
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #27ae60;
  }
`;

const ScheduleContainer = styled.div`
  margin-top: 30px;
`;

const ScheduleItem = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Time = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const Task = styled.span`
  margin-left: 10px;
  color: #2c3e50;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
`;

const LoadingText = styled.p`
  margin-top: 20px;
  color: #2c3e50;
`;

interface ScheduleItem {
  time: string;
  task: string;
  explanation: string;
}

function App() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (tasks.length === 0) return;
    
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL + '/plan';
      const response = await axios.post(apiUrl, { tasks: tasks.join('\n') });
      setSchedule(response.data.schedule);
    } catch (error) {
      console.error('Error planning schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Title>Daily Flow Optimizer, please enter your tasks for today</Title>
      
      <TaskInputContainer>
        <TaskInput
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <AddButton onClick={handleAddTask}>
           Add
        </AddButton>
      </TaskInputContainer>

      <TaskList>
        {tasks.map((task, index) => (
          <TaskItem key={index}>
            <TaskText>{task}</TaskText>
            <DeleteButton onClick={() => handleDeleteTask(index)}>
              <FaTrash />
            </DeleteButton>
          </TaskItem>
        ))}
      </TaskList>

      {tasks.length > 0 && (
        <SubmitButton onClick={handleSubmit}>
          Optimize My Day
        </SubmitButton>
      )}

      {loading && (
        <LoadingContainer>
          <CircularProgressbar value={100} text="Planning..." />
          <LoadingText>We're optimizing your day...</LoadingText>
        </LoadingContainer>
      )}

      {schedule.length > 0 && (
        <ScheduleContainer>
          <h2>Your Optimized Schedule</h2>
          {schedule.map((item, index) => (
            <ScheduleItem key={index}>
              <Time>{item.time}:</Time>
              <Task>{item.task}</Task>
              <p>{item.explanation}</p>
            </ScheduleItem>
          ))}
        </ScheduleContainer>
      )}
    </AppContainer>
  );
}

export default App; 