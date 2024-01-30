import { useState, ChangeEvent, useEffect, useContext } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { finishPickUpAppointment, getDataFromQRCode, getDataFromQRCodeSecond } from "../../services/appointmentService";
import { getAppointmentsByAdminId,  penaliseUser, pickUpEquipment } from "../../services/appointmentService";
import { AxiosResponse } from "axios";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User, UserDetails, UserRole } from '../../model/user';
import { getUser, getUserDetails } from '../../services/authorizationService';
import jsQR from 'jsqr';
import { UserContext } from "../../App";
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
    const queryClient = useQueryClient();
    const userContext = useContext(UserContext);
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
        
    const appointmentPickedupMutation = useMutation(pickUpEquipment, {
        onSuccess: () => {
            // setEquipment(data.data);
            queryClient.invalidateQueries(['appointments/byAdminId', userDetails.id]);
        },
    });

    const appointmentPenalisedMutation = useMutation(penaliseUser, {
        onSuccess: () => {
            // setEquipment(data.data);
            queryClient.invalidateQueries(['appointments/byAdminId', userDetails.id]);
        },
    });
    
    const markAsPickedUpClick = (id: number) => {
        appointmentPickedupMutation.mutate(id);
    };

    const penaliseUserAfterExpiredReservationClick = (uid: number, id: number) => {
        appointmentPenalisedMutation.mutate({
            userId: uid,
            appointmentId: id,
        });
    };

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
        if (event.target.files !== null) {
            const file = event.target.files[0];
            console.log(file);
    
            if (file) {
                setSelectedImage(file);

                const reader = new FileReader();

                reader.onload = async (e) => {
                    try {
                        const img = new Image();
                        img.src = URL.createObjectURL(file);

                        img.onload = () => {
                            const width = img.width;
                            const height = img.height;

                            const binaryData = e.target?.result as ArrayBuffer;
            
                            const code = jsQR(new Uint8ClampedArray(binaryData), width, height);
            
                            if (code) {
                              setQRData(code.data);
                              console.log('Decoded QR Code:', code.data);
                            } else {
                              console.log('QR Code not detected or could not be decoded.');
                            }
                        };
                    } catch (error) {
                        console.error('Error decoding QR code:', error);
                    }
                };

                reader.readAsArrayBuffer(file);
            }
        }
    };

    const pickUpMutation = useMutation(finishPickUpAppointment,
    {
        onSuccess: () => {
            setQRData('');
            setSelectedImage(null);
            queryClient.invalidateQueries(['qrData', userContext.user.id]);
            queryClient.invalidateQueries(['appointments/byAdminId', userDetails.id]);
        }
    })

    const pickUpClick = (qr: File | null) => {
        if (qr) {
            pickUpMutation.mutate(qr);
        } else {
            throw new Error("No selected image");
        }
    };
    function shouldPickup(appointmentDateTime: Date, duration: number): boolean{
        
        const Date1 = new Date(appointmentDateTime);
        const year = Date1.getFullYear()
        const month = Date1.getMonth()
        const day = Date1.getDay()
        const hour = Date1.getHours()
        const minute = Date1.getMinutes()

        const start1 = { hours: hour, minutes: minute };
        const end1 = getEndTime(hour, minute, duration);


        const currentDateTime = new Date();
        const tempYear = currentDateTime.getFullYear()
        const tempMonth = currentDateTime.getMonth()
        const tempDay = currentDateTime.getDay()
        const tempHours = currentDateTime.getHours()
        const tempMinutes = currentDateTime.getMinutes()

        const currTime = { hours: tempHours,  minutes: tempMinutes }

        if(year === tempYear && month === tempMonth && day === tempDay){
            if(start1.hours * 60 + start1.minutes <= currTime.hours * 60 + currTime.minutes && end1.hours * 60 + end1.minutes >= currTime.hours * 60 + currTime.minutes){
                return true;
            }
        }

        return false;
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
                    {qrData !== 'penalized' && qrData !== '' && qrData !== 'early' && <button onClick={() => pickUpClick(selectedImage)}>Pick up done</button>}
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
                        {(appointment.status.toString() !== 'PENALISED' && appointment.status.toString() !== 'PICKEDUP') ? (
                            <div>
                                {shouldPickup(appointment.dateTime, appointment.duration) ? (
                                    // <CardActions>
                                    //     <Button  variant="contained" size="small">Mark as picked up</Button>
                                    // </CardActions>
                                    <div>
                                        User came in time, you can mark his reservation as picked up.
                                        <br />
                                        <Button onClick={() => markAsPickedUpClick(appointment.id)} variant="contained" size="small">Mark as picked up</Button>
                                    </div>
                                ) : (
                                    <div>
                                        Reservation has expired. You can penalise this user.
                                        <br />
                                        <Button onClick={() => penaliseUserAfterExpiredReservationClick(appointment.userId!, appointment.id)} variant="contained" size="small">Penalise</Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </Card>
                ))}
            </div>

        </div>
    );
}