import { Button, Card, CardActions, CardContent, CardMedia, TextField, Typography } from '@mui/material';
import { Appointment, AppointmentStatus } from '../../model/appointment';
import { useContext, useState } from 'react';
import { createEmergencyAppointment, getAvailableAppointments } from '../../services/appointmentService';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { format } from 'date-fns';
import { UserContext } from '../../App';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function CreateEmergencyAppointment() {
    const userContext = useContext(UserContext);
    const [availableAppointment, setAvailableAppointment] = useState<Appointment[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const selectedEquipment = location.state.selectedEquipment;

    const handleDateChange = (newDate: Date | null) => {
        setSelectedDate(newDate!);
        if (newDate != null) setIsButtonDisabled(false);
    };

    const availableAppointmentMutation = useMutation(getAvailableAppointments, {
        onSuccess: (appointments: AxiosResponse<Appointment[]>) => {
            setAvailableAppointment(appointments.data);
        }
    })

    const reserveMutation = useMutation(createEmergencyAppointment, {
        onSuccess: () => {
            navigate('/');
        }
    })

    const reserveAppointment = (appointment: Appointment) => {
        appointment.equipmentList = selectedEquipment;
        appointment.reserved = true;
        appointment.status = AppointmentStatus.PROCESSED;
        appointment.userId = userContext.user.id;
        console.log(appointment)
        reserveMutation.mutate(appointment);
    };

    const handleSearch = () => {
        const tomorrow = new Date(selectedDate!);
        tomorrow.setDate(new Date(selectedDate!).getDate() + 1);
        const formattedDate = tomorrow.toISOString().slice(0, 19).replace(" ", "T");
        console.log(formattedDate)
        availableAppointmentMutation.mutate({date: formattedDate, companyId: Number(params.companyId)});
    };


    return (
        <div>
            <h1>Create emergency appointment</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} label="Select Date" />}
                disablePast
                />
            </LocalizationProvider>
            <Button variant="contained" color="primary" onClick={() => handleSearch()} disabled={isButtonDisabled}>Show available</Button>

            <h1>Appointments:</h1>
                    {availableAppointment.map((appointment) => (
                        <Card className="appointment-card" sx={{ maxWidth: 700 }}>
                        <CardMedia
                            sx={{ height: 140 }}
                            image="https://ba.alfinemed.com/uploads/202238237/small/beaker-low-form24291268583.jpg"
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                            Appointment opening time: {format(appointment.dateTime, 'dd.MM.yyyy. HH:mm')}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => reserveAppointment(appointment)} variant="contained" size="small">Reserve</Button>
                        </CardActions>
                        </Card>
                    ))}
            </div>
    );
}
