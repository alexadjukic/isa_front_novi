import { useState, ChangeEvent, useEffect } from "react";
import { useQuery } from "react-query";
import { getAppointmentsByAdminId, getDataFromQRCode } from "../../services/appointmentService";
import { AxiosResponse } from "axios";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User, UserDetails, UserRole } from '../../model/user';
import { getUser, getUserDetails } from '../../services/authorizationService';
import { Link } from "react-router-dom";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { format } from 'date-fns';
import classes from './PickUpEquipment.module.css'
import { Appointment } from "../../model/appointment";
import { getAllUsers } from "../../services/userService";

export default function PickUpEquipment() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [qrData, setQRData] = useState<string | null>(null);
    const { getItem: getToken } = useLocalStorage('jwtToken');
    const [ user ] = useState<User>(getUser(getToken()));
    const [ userDetails, setUserDetails ] = useState<UserDetails>({id: 0, username: '', role: UserRole.UNAUTHENTICATED, email: '', password: '', firstName: '', lastName: '', addressId: 0, phoneNumber: '', profession: '', companyId: 0, penaltyPoints: 0});
    const [ appointments, setAppointments ] = useState<Appointment[]>([]);
    const [usersMap, setUsersMap] = useState<{ [key: number]: string }>({});

    const allUsersQuery = useQuery(
        ['users/allusers'],
        () => getAllUsers(),
        {
            onSuccess: (data: AxiosResponse<UserDetails[]>) => {
                const users = data.data;
                const usersMapping: { [key: number]: string } = {};
                users.forEach(user => {
                    usersMapping[user.id] = user.username;
                });
                setUsersMap(usersMapping);
            }
        }
    );

    const getAppointmentsQuery = useQuery(
        ['appointments/byAdminId', userDetails.id],
        () => getAppointmentsByAdminId(userDetails.id),
        {
            onSuccess: (data: AxiosResponse<Appointment[]>) => {
                setAppointments(data.data);
            },
            enabled: userDetails.id !== 0
        }
    )

    const getLoggedUser = useQuery(
        ['users',  user.id],
        () => getUserDetails(user.id),
        {
            onSuccess: (data: AxiosResponse<UserDetails>) => {
                setUserDetails(data.data);
            },
            enabled: user.id !== 0
        }
    );

    const qrDataQuery = useQuery(['qrData', selectedImage],
        async () => {
            if (selectedImage) {
                const response = await getDataFromQRCode(selectedImage);
                return response;
            } else {
                // Ako selectedImage === null, možete implementirati odgovarajući tretman
                throw new Error("No selected image");
            }
        },
        {
            onSuccess: (data: AxiosResponse<string>) => {
                setQRData(data.data);
            },
        },
    );

    useEffect(() => {
        // getLoggedUser.refetch();
    },[user, userDetails, getLoggedUser, appointments])

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];

        if (file) {
            // You can save the file object or its data (e.g., base64) to the state
            setSelectedImage(file);
        }

        if (qrDataQuery.isSuccess)
        setQRData(qrDataQuery.data.data);
    };

    return (
        <div>
            <p>Pick up equipment</p>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            {selectedImage && (
                <div>
                    <p>Selected Image:</p>
                    <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                    <button>Do pick up</button>
                </div>
            )}
            {qrData && (
                <div>
                    <p>QR Data:</p>
                    <p>{qrData}</p>
                </div>
            )}

            <div className={`${classes.appointmentsContainer}`}>
                <h1 style={{marginBottom: 30}}>Reservations in my company:</h1>
                
                {appointments?.map((appointment, index) => (
                    <Card key={index} className={`${classes.appointmentCard}`} sx={{backgroundColor: 'wheat', width: 1100, minHeight: 400 }}>
                        <CardMedia
                            sx={{ height: 250 }}
                            image="https://butterflyrelease.biz/cdn/shop/products/Package-fee-5_grande.jpg?v=1642822684"
                            title="Pickup"
                        />
                        <CardContent sx={{ display: "flex", flexDirection: "column", textAlign: "left"}}>
                            <Typography variant="body2" color="text.secondary">
                                Appointment opening time: {format(appointment.dateTime, 'dd.MM.yyyy. HH:mm')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Duration: {appointment.duration} minutes
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Status: {appointment.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Equipment List: 
                            </Typography>
                            {appointment.equipmentList.map((equipment, index) =>(
                                <Typography key={index} variant="body2" color="text.secondary">
                                    {equipment.name}
                                </Typography>
                            ))}
                            <Typography variant="body2" color="text.secondary">
                                Customer username: {usersMap[appointment.userId!]}
                            </Typography>
                            
                        </CardContent>
                        {/* {userDetails.role.toString() === 'USER' ? (
                            <CardActions>
                                {appointment.reserved === false ? (
                                    <Button onClick={() => reserveAppointment(appointment)} variant="contained" size="small" disabled={selectedEquipment.length === 0}>Reserve</Button>
                                ) : (
                                    <p className="already-reserved-p">Someone already reserved.</p>
                                )}
                            </CardActions>
                        ) : (
                            <p></p>
                        )} */}
                    </Card>
                ))}
            </div>

        </div>
    );
}