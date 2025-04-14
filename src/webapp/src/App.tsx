import React, { useState } from 'react';
import styled from 'styled-components';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
`;

const InputContainer = styled.div`
  margin: 20px 0;
`;

const TaskInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 2px solid #3498db;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #2980b9;
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
  const [tasks, setTasks] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const handleSubmit = async () => {
    if (!tasks.trim()) return;
    
    setLoading(true);
    try {
      const apiUrl = import.meta.env.PROD ? '/plan' : 'http://localhost:8080/plan';
      const response = await axios.post(apiUrl, { tasks });
      setSchedule(response.data.schedule);
    } catch (error) {
      console.error('Error planning schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Title>Daily Flow Optimizer</Title>
      <InputContainer>
        <TaskInput
          placeholder="Enter your tasks for today (one per line)"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
        />
        <SubmitButton onClick={handleSubmit}>Optimize My Day</SubmitButton>
      </InputContainer>

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