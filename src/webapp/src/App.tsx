import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'react-circular-progressbar/dist/styles.css';
import { getSchedule } from './services/plan.service';
import { Schedule } from './models/schedule';

const AppContainer = styled.div`
  width: 768px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 50px;
`;

const Subtitle = styled.h4`
  text-align: left;
  color: #2c3e50;
  margin: 0;
`;

const TaskInputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
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
  padding: 10px 28px;
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

const TaskItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const TaskItem = styled.li`
  flex: 1;
  text-align: left;
  border-radius: 5px;
  padding: 10px;
  padding-right: 0;
  margin-right: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TaskText = styled.span`
  text-align: left;
`;

const DeleteButton = styled.button.attrs({
  type: 'button'
})`
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
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
  padding: 10px 20px;
  background-color: ${props => props.disabled ? '#95a5a6' : '#2ecc71'};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 10px;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:hover {
    background-color: ${props => props.disabled ? '#95a5a6' : '#27ae60'};
  }
`;

const ScheduleContainer = styled.div`
  color: #2c3e50;
  margin-top: 30px;
`;

const ScheduleTitle = styled.h2`
  text-align: center;
`;

const ScheduleExplanation = styled.p`
  text-align: justify;
  margin-bottom: 10px;
  font-size: 18px;
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: start;
  background-color: #f8f9fa;
  padding: 10px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Time = styled.span`
  font-weight: bold;
  width: 80px;
  display: inline-block;
  text-align: right;
  padding-right: 5px;
`;

const Task = styled.span`
  flex: 1;
  margin-left: 5px;
  text-align: left;
  display: inline-block;
`;

const progressAnimation = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const InfiniteProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: linear-gradient(
    90deg,
    #2ecc71 0%,
    #27ae60 25%,
    #2ecc71 50%,
    #27ae60 75%,
    #2ecc71 100%
  );
  background-size: 200% 100%;
  animation: ${progressAnimation} 1.5s linear infinite;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(46, 204, 113, 0.3);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const LoadingText = styled.p`
  margin: 0;
  color: #2c3e50;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
`;

function App() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState<string>();

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
    setSchedule(null);
    setError('');
    try {
      const schedule = await getSchedule(tasks);
      setSchedule(schedule);
    } catch (error) {
      setError('Failed to generate schedule. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Title>Daily Flow Optimizer</Title>

      <Subtitle>Enter your tasks for today</Subtitle>
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
          <TaskItemContainer key={index}>
            <TaskItem>
              <TaskText>{task}</TaskText>
            </TaskItem>
            <DeleteButton onClick={() => handleDeleteTask(index)}>
              <FaTrash /> Delete
            </DeleteButton>
          </TaskItemContainer>
        ))}
      </TaskList>

      <SubmitButton onClick={handleSubmit} disabled={loading || tasks.length === 0}>
        Optimize my day
      </SubmitButton>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading && (
        <LoadingContainer>
          <InfiniteProgressBar />
          <LoadingText>Getting your schedule...</LoadingText>
        </LoadingContainer>
      )}

      {!loading && schedule && (
        <ScheduleContainer>
          <ScheduleTitle>Here is your optimized schedule</ScheduleTitle>
          <ScheduleExplanation>{schedule.explanation}</ScheduleExplanation>
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