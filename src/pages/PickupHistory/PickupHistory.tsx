import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, SelectChangeEvent, Typography } from '@mui/material';
import { Appointment } from '../../model/appointment';
import { useContext, useState } from 'react';
import { getAppointmentsByUserId } from '../../services/appointmentService';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { UserContext } from '../../App';
import { Equipment } from '../../model/equipment';

export default function PickupHistory() {
    const userContext = useContext(UserContext);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [sortBy, setSortBy] = useState<string>('date');

    useQuery(
        ['appointments', userContext.user.id],
        () => getAppointmentsByUserId(userContext.user.id),
        {
            onSuccess: (data: AxiosResponse<Appointment[]>) => {
                setAppointments(data.data);
            },
        },
    );

    const handleSortByChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value);
        const sortBy = event.target.value;

        const sortedAppointments = [...appointments];

        sortedAppointments.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
            }
            else if (sortBy === 'price') {
                const calculateTotalPrice = (equipmentList: Equipment[]) => {
                    return equipmentList.reduce((total, equipment) => total + equipment.price, 0);
                };
            
                return calculateTotalPrice(b.equipmentList) - calculateTotalPrice(a.equipmentList);
            }
            else if (sortBy === 'duration') {
                return b.duration - a.duration;
            }

            return 0;
        });

        setAppointments(sortedAppointments);
    }

    return (
        <Box>
            <Typography variant="h5">Pickup History</Typography>
            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Sort by:</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={sortBy}
                    onChange={handleSortByChange}
                >
                    <FormControlLabel value="date" control={<Radio />} label="Date" />
                    <FormControlLabel value="price" control={<Radio />} label="Price" />
                    <FormControlLabel value="duration" control={<Radio />} label="Duration" />
                </RadioGroup>
            </FormControl>
            {appointments.map(appointment => (
                <Box
                    key={appointment.id}
                    mt={2}
                    p={2}
                    border={1}
                    borderColor="primary.main">
                    <Typography variant="h6">{`Date of pickup: ${format(appointment.dateTime, 'dd.MM.yyyy. HH:mm')}`}</Typography>
                    <Typography variant="body1">{`Duration: ${appointment.duration}`}</Typography>
                    <Typography variant="body1">{`Status: ${appointment.status}`}</Typography>
                    {/* Display equipment for this appointment */}
                    <Typography variant="h6">Equipment:</Typography>
                    <ul>
                        {appointment.equipmentList.map((item, index) => (
                            <li key={index}>
                                {item.name} - Price: {item.price}$
                            </li>
                        ))}
                    </ul>
                </Box>
            ))}
        </Box>
    );
}
