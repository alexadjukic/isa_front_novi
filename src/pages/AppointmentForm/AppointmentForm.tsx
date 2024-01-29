import { Button, Input, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, TextField, Stack, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Appointment, AppointmentStatus } from "../../model/appointment";
import { UserContext } from "../../App";
import { UserDetails, UserRole } from "../../model/user";
import { useMutation, useQuery } from "react-query";
import { getUserByUsername, getUserDetailsById } from "../../services/userService";
import { AxiosResponse } from "axios";
import { createAppointment, getAppointmentsByCompanyId } from "../../services/appointmentService";
import { useNavigate } from "react-router";
import { getAdministratorsByCompanyId } from "../../services/authorizationService";
import classes from './AppointmentForm.module.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


export default function AppointmentForm() {
    const [appointment, setAppointment] = useState<Appointment>({
        id: 0,
        dateTime: new Date('2024-01-29 10:00:00'),
        duration: 0,
        status: AppointmentStatus.NEW,
        companyId: 0,
        isReserved: false,
        userId: undefined,
        adminId: 0,
        equipmentList: []
    });
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDetails>({
        id: 0,
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        addressId: 0,
        phoneNumber: '',
        profession: '',
        role: UserRole.UNAUTHENTICATED,
        companyId: 0,
        penaltyPoints: 0
    });
    const [selectedUser, setSelectedUser] = useState<UserDetails>({
        id: 0,
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        addressId: 0,
        phoneNumber: '',
        profession: '',
        role: UserRole.UNAUTHENTICATED,
        companyId: 0,
        penaltyPoints: 0
    });
    const [selectedUsername, setSelectedUsername] = useState<string>('');
    const [companyAdmins, setCompanyAdmins] = useState<UserDetails[]>([]);
    const [pickedDateTime, setPickedDateTime] = useState<Date | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const appointmentsByCompanyIdQuery = useQuery(
        ['appointments/byCompanyId', user.companyId],
        () => getAppointmentsByCompanyId(user.companyId), {
            onSuccess: (data: AxiosResponse<Appointment[]>) => {
                setAppointments(data.data);
            },
            enabled: user.id !== 0
        }
    );

    const companyAdminsQuery = useQuery(
        ['users/byCompanyId/', user.companyId],
        () => getAdministratorsByCompanyId(user.companyId), {
            onSuccess: (data: AxiosResponse<UserDetails[]>) => {
                setCompanyAdmins(data.data);
            },
            enabled: user.id !== 0
        });

    const appointmentMutation = useMutation(createAppointment, {
        onSuccess: (data: AxiosResponse<Appointment>) => {
            setAppointment(data.data);
            // queryClient.invalidateQueries(['equipmentById', params.id]);
        },
    });

    const userQuery = useQuery(
        ['users', userContext.user.id],
        () => getUserDetailsById(userContext.user.id),
        {
            onSuccess: (data: AxiosResponse<UserDetails>) => {
                setUser(data.data);
            },
            enabled: userContext.user.id !== 0,
            // staleTime: Infinity,
        },
    );

    const selectedUserQuery = useQuery(
        ['users/getByUsername', selectedUsername],
        () => getUserByUsername(selectedUsername),
        {
            onSuccess: (data: AxiosResponse<UserDetails>) => {
                setSelectedUser(data.data);
            },
            enabled: selectedUsername !== '',
        },
    );

    useEffect(() => {
        // companyAdminsQuery.refetch();
    }, [user, appointment, selectedUser, companyAdmins]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(pickedDateTime){
            appointment.companyId = user.companyId;
            appointment.adminId = selectedUser.id
            if(pickedDateTime){
                appointment.dateTime = pickedDateTime;
            }
            if(!doesOverlap()){
                appointmentMutation.mutate(appointment);
                navigate('/');
            }else{
                alert("Usao sam u else, znaci overlappuje se")
            }
        }else{
            alert("You have to pick date!")
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        const createdAppointment = { ...appointment, [id]: value };
        setAppointment(createdAppointment);
    };

    const handleInputChangeSelect = (event: SelectChangeEvent<string>) => {
        const { value } = event.target; // Ukloni 'id' jer Select element nema 'id'
        const selectedUsernameTemp = value; // Koristi 'type' kao ključ za ažuriranje
        setSelectedUsername(selectedUsernameTemp);
    };

    function doesOverlap(): boolean {
        const selectedDateTemp = new Date(appointment.dateTime);
        const tempYear = selectedDateTemp.getFullYear()
        const tempMonth = selectedDateTemp.getMonth()
        const tempDay = selectedDateTemp.getDay()
        const tempHours = selectedDateTemp.getHours()
        const tempMinutes = selectedDateTemp.getMinutes()
        let result = false;

        appointments.forEach( (item: Appointment)  => {
            const Date1 = new Date(item.dateTime);
            const year = Date1.getFullYear()
            const month = Date1.getMonth()
            const day = Date1.getDay()
            const hour = Date1.getHours()
            const minute = Date1.getMinutes()
      
            if(year === tempYear && month === tempMonth && day === tempDay){
              const start1 = { hours: hour, minutes: minute };
              const end1 = getEndTime(hour, minute, item.duration);
              const start2 = { hours: tempHours, minutes: tempMinutes };
              const end2 = getEndTime(tempHours, tempMinutes, +appointment.duration);
      
              if (
                (start1.hours * 60 + start1.minutes <= end2.hours * 60 + end2.minutes && end1.hours * 60 + end1.minutes >= start2.hours * 60 + start2.minutes)|| 
                (start1.hours * 60 + start1.minutes <= start2.hours * 60 + start2.minutes && end1.hours * 60 + end1.minutes >= end2.hours * 60 + end2.minutes)
              ) {
                result =  true;
              } 
            }
        })
      
        return result;
    }

    interface Time {
        hours: number;
        minutes: number;
    }

    function getEndTime(hour: number, minute: number, duration: number): Time{
        const totalMinutes = hour * 60 + minute + duration;
        const endHour = Math.floor(totalMinutes / 60);
        const endMinute = totalMinutes % 60;
        return { hours: endHour, minutes: endMinute };
    }

    if(companyAdminsQuery.isLoading){
        <p>Loading...</p>
    }
    


    return (
        <div className={`${classes.appointmentForm}`}>
            <form onSubmit={handleSubmit}>

                <div>
                <FormControl variant="outlined"  margin="normal" size="small">
                    <InputLabel id="filterDropdown-label" >Company Admin Username:</InputLabel>
                    <br/>
                    <br />
                    {companyAdmins.length > 0 ? (
                        <Select
                        labelId="filterDropdown-label"
                        id="selectedUsername"
                        size="small"
                        style={{ width: '200px' }}
                        onChange={handleInputChangeSelect}
                        value={selectedUsername}
                        required
                        >
                        
                        {companyAdmins.map((temp) => (
                            <MenuItem key={temp.username} value={temp.username}>
                                {temp.username}
                            </MenuItem>
                        ))}
                        </Select>
                    ) : (
                        <div>Loading...</div>
                    )}
                </FormControl>
                </div>

                <div>
                <label>First Name: {selectedUser.firstName}</label>
                <br/>
                <label>Last Name: {selectedUser.lastName}</label>
                <br />
                </div>

                <div>
                <InputLabel htmlFor="dateTime">Date/Time:</InputLabel>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                            value={pickedDateTime}
                            onChange={setPickedDateTime}
                            />
                    </LocalizationProvider>
                </FormControl>
                </div>
                <br />
                <div>
                <FormControl>
                <InputLabel  htmlFor="duration">Duration (in minutes)</InputLabel>
                    <Input
                    id="duration"
                    aria-describedby="my-helper-text"
                    value={appointment.duration}
                    type="number"
                    onChange={handleInputChange}
                    required
                    />
                </FormControl>
                </div>

                <div>
                    <Button variant="contained" type="submit">Create Appointment</Button>
                </div>

            </form>
        </div>
    );
}