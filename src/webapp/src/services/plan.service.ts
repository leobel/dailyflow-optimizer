import axios from 'axios';
import { Schedule } from '../models/schedule';
import { ScheduleDto } from '../models/dtos/schedule.dto';
import { ScheduleItemDto } from '../models/dtos/schedule-item.dto';

export const getPlan = async (tasks: string[]): Promise<Schedule> => {
    const apiUrl = import.meta.env.VITE_API_URL + '/plan';
    const response = await axios.post<ScheduleDto>(apiUrl, { tasks: tasks.join('\n') });
    return response.data.items.reduce((acc: Schedule, item: ScheduleItemDto) => {
        acc.explanations.push(item.explanation);
        const { time, task } = item;
        acc.tasks.push({ time, task });
        return acc;
    }, { explanations: [], tasks: [] });
}