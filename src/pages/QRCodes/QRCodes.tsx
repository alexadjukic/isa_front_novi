import { Appointment } from '../../model/appointment';
import { useContext, useState } from 'react';
import { getAppointmentsByUserId } from '../../services/appointmentService';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { UserContext } from '../../App';
import QRCode from 'qrcode.react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, SelectChangeEvent } from '@mui/material';
import { format } from 'date-fns';

export default function QRCodes() {
    const userContext = useContext(UserContext);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [originalAppointments, setOriginalAppointments] = useState<Appointment[]>([]);
    const [filterBy, setFilterBy] = useState<string>('all');

    const appointmentQuery = useQuery(
        ['qrcodes', userContext.user.id],
        () => getAppointmentsByUserId(userContext.user.id),
        {
            onSuccess: (data: AxiosResponse<Appointment[]>) => {
                setAppointments(data.data);
                setOriginalAppointments(data.data);
            },
        },
    );

    const handleFilterByChange = (event: SelectChangeEvent<string>) => {
        setFilterBy(event.target.value);
        const filterBy = event.target.value;

        if (filterBy !== 'ALL') {
            const filteredAppointments = originalAppointments.filter(appointment => appointment.status.toString() === filterBy);
            setAppointments(filteredAppointments);
        }
        else
            appointmentQuery.refetch();
    }

    return (
        <Box>
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={filterBy}
                    onChange={handleFilterByChange}
                >
                    <FormControlLabel value="NEW" control={<Radio />} label="New" />
                    <FormControlLabel value="PROCESSED" control={<Radio />} label="Processed" />
                    <FormControlLabel value="DENIED" control={<Radio />} label="Denied" />
                    <FormControlLabel value="ALL" control={<Radio />} label="Show all" />
                </RadioGroup>
            </FormControl>
            <div>
                {appointments.map((appointment) => (
                    <div key={appointment.id}>
                        <h3>Appointment status: {appointment.status}</h3>
                        <p>Date and Time: {format(appointment.dateTime, "dd.MM.yyyy. HH:mm")}</p>
                        {/* Add other essential information here */}
                        <QRCode
                            value={`Appointment status: ${appointment.status}\nDate and Time: ${format(appointment.dateTime, "dd.MM.yyyy. HH:mm")}\nEquipment list: ${appointment.equipmentList.map(equipment => `${equipment.name} - ${equipment.price}`).join(', ')}`}
                            size={128}
                        />
                        <hr />
                    </div>
                ))}
            </div>
        </Box>
    );
}
