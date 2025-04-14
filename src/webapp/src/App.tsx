import React, { useState } from 'react';
import styled from 'styled-components';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'react-circular-progressbar/dist/styles.css';
import { getPlan } from './services/plan.service';
import { Schedule } from './models/schedule';
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

const TaskInput = styled.input.attrs({
  type: 'text',
  placeholder: 'Add a new task...'
})`
  flex: 1;
  padding: 10px;
  border: 2px solid #3498db;
  border-radius: 5px;
  font-size: 16px;
`;

const AddButton = styled.button.attrs({
  type: 'button'
})<{ disabled?: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.disabled ? '#95a5a6' : '#3498db'};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${props => props.disabled ? '#95a5a6' : '#2980b9'};
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

const DeleteButton = styled.button.attrs({
  type: 'button'
})`
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

const SubmitButton = styled.button.attrs({
  type: 'button'
})<{ disabled?: boolean }>`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: ${props => props.disabled ? '#95a5a6' : '#2ecc71'};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 10px;

  &:hover {
    background-color: ${props => props.disabled ? '#95a5a6' : '#27ae60'};
  }
`;

const ScheduleContainer = styled.div`
  color: #2c3e50;
  margin-top: 30px;
`;

const ScheduleExplanation = styled.p`
  text-align: left;
  margin-bottom: 10px;
  font-size: 18px;
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: start;
  background-color: #f8f9fa;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Time = styled.span`
  font-weight: bold;
`;

const Task = styled.span`
  flex: 1;
  margin-left: 10px;
  text-align: left;
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

function App() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>();

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
      const schedule = await getPlan(tasks);
      setSchedule(schedule);
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
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <AddButton onClick={handleAddTask} disabled={loading || newTask.trim() === ''}>
          <FaPlus /> Add
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

      <SubmitButton onClick={handleSubmit} disabled={loading || tasks.length === 0}>
        Optimize My Day
      </SubmitButton>

      {loading && (
        <LoadingContainer>
          <CircularProgressbar value={100} text="Planning..." />
          <LoadingText>We're optimizing your day...</LoadingText>
        </LoadingContainer>
      )}

      {schedule && (
        <ScheduleContainer>
          <h2>Your Optimized Schedule</h2>
          <ScheduleExplanation>{schedule.explanations.join(' ')}</ScheduleExplanation>
          {schedule.tasks.map((item, index) => (
            <ScheduleItem key={`schedule-item-${index}-${item.time}`}>
              <Time>{item.time}:</Time>
              <Task>{item.task}</Task>
            </ScheduleItem>
          ))}
        </ScheduleContainer>
      )}
    </AppContainer>
  );
}

export default App;