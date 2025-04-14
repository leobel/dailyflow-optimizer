import axios from 'axios';
import { Schedule } from '../models/schedule';

export const getSchedule = async (tasks: string[]): Promise<Schedule> => {
    const apiUrl = import.meta.env.VITE_API_URL + '/schedule';
    const response = await axios.post<Schedule>(apiUrl, { tasks });
    return response.data;
}