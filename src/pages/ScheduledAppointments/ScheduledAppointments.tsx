import { Box, Typography } from '@mui/material';
import { Appointment } from '../../model/appointment';
import { useState } from 'react';
import { getUser } from '../../services/authorizationService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getAppointmentsByUserId } from '../../services/appointmentService';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

export default function ScheduledAppointments() {
    const { getItem: getToken } = useLocalStorage('jwtToken');
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useQuery(
        ['appointments', getUser(getToken()).id],
        () => getAppointmentsByUserId(getUser(getToken()).id),
        {
            onSuccess: (data: AxiosResponse<Appointment[]>) => {
                setAppointments(data.data);
            },
        },
    );

    return (
        <Box>
            <Typography variant="h5">Scheduled Appointments</Typography>
            {appointments.map(appointment => (
                <Box
                    key={appointment.id}
                    mt={2}
                    p={2}
                    border={1}
                    borderColor="primary.main">
                    <Typography variant="h6">{`Date: ${appointment.dateTime}`}</Typography>
                    <Typography variant="body1">{`Status: ${appointment.status}`}</Typography>
                    {/* Add more appointment details as needed */}
                </Box>
            ))}
        </Box>
    );
}
