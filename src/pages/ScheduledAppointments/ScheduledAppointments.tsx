import { Box, Button, Typography } from '@mui/material';
import { Appointment } from '../../model/appointment';
import { useContext, useState } from 'react';
import {
    cancelAppointment,
    getAppointmentsByUserId,
} from '../../services/appointmentService';
import { AxiosResponse } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { UserContext } from '../../App';

export default function ScheduledAppointments() {
    const userContext = useContext(UserContext);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const queryClient = useQueryClient();

    useQuery(
        ['appointments', userContext.user.id],
        () => getAppointmentsByUserId(userContext.user.id),
        {
            onSuccess: (data: AxiosResponse<Appointment[]>) => {
                setAppointments(data.data);
            },
        },
    );

    const appointmentMutation = useMutation(cancelAppointment, {
        onSuccess: () => {
            queryClient.invalidateQueries([
                'appointments',
                userContext.user.id,
            ]);
            queryClient.invalidateQueries(['users', userContext.user.id]);
        },
    });

    const cancelAppointmentClick = (id: number) => {
        appointmentMutation.mutate({
            appointmentId: id,
            userId: userContext.user.id,
        });
    };

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
                    <Typography variant="h6">{`Date: ${format(appointment.dateTime, 'dd.MM.yyyy. HH:mm')}`}</Typography>
                    <Typography variant="body1">{`Status: ${appointment.status}`}</Typography>
                    {/* Display equipment for this appointment */}
                    <Typography variant="h6">Equipment:</Typography>
                    <ul>
                        {appointment.equipmentList.map((item, index) => (
                            <li key={index}>
                                {item.name} --- Price: {item.price}RSD
                            </li>
                        ))}
                    </ul>
                    <Button
                        onClick={() => cancelAppointmentClick(appointment.id)}>
                        Cancel
                    </Button>
                </Box>
            ))}
        </Box>
    );
}
