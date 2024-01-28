import { Button, CardActions, CardContent, CardMedia, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Card from "@mui/material/Card";
import classes from './CompanyView.module.css';
// import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { getAdministratorsByCompanyId, getUser, getUserDetails } from '../../services/authorizationService';
import { User, UserDetails, UserRole } from '../../model/user';
import { useMutation, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { Company } from '../../model/company';
import { getCompanyById } from '../../services/companyService';
import { Link, useParams } from 'react-router-dom';
import { Equipment } from '../../model/equipment';
import { deleteEquipmentById, getAllEquipmentByCompanyId } from '../../services/equipmentService';
import { Appointment } from '../../model/appointment';
import { getAppointmentsByCompanyId } from '../../services/appointmentService';
import { format } from 'date-fns';
import { Address } from '../../model/address';
import { getAddressById } from '../../services/addressService';

export default function CompanyView() {
    // const navigate = useNavigate();
    const { getItem: getToken } = useLocalStorage('jwtToken');
    const [ user ] = useState<User>(getUser(getToken()));
    const [ userDetails, setUserDetails ] = useState<UserDetails>({id: 0, username: '', role: UserRole.UNAUTHENTICATED, email: '', password: '', firstName: '', lastName: '', addressId: 0, phoneNumber: '', profession: '', companyId: 0, penaltyPoints: 0});
    const [company, setCompany] = useState<Company>({id: 0, companyName: '', addressId: 0, description: '', rating: 0.0, address: {id: 0, country: '', city: '', street: '', streetNumber: 0, latitude: 0.0, longitude: 0.0}});
    const [administrators, setAdministrators] = useState<UserDetails[]>();
    const [equipment, setEquipment] = useState<Equipment[]>();
    const [appointments, setAppointments] = useState<Appointment[]>();
    const [address, setAddress] = useState<Address>({id: 0, country: '', city: '', street: '', streetNumber: 0, latitude: 0.0, longitude: 0.0});
    const [equipForDelId, setEquipForDelId] = useState<number>(0);
    const params = useParams();

    const getLoggedUser = useQuery(
        ['users',  user.id],
        () => getUserDetails(user.id),
        {
            onSuccess: (data: AxiosResponse<UserDetails>) => {
                setUserDetails(data.data);
            },
            enabled: user ? true : false
        }
    );
        
    const getCompanyByUser = useQuery(
        ['companies', params.id],
        () => getCompanyById(params.id),
        {
            onSuccess: (data: AxiosResponse<Company>) => {
                setCompany(data.data);
            },
            enabled: userDetails.id !== 0
        }
    );

    const getAdministrators = useQuery(
        ['users/byCompanyId', company.id],
        () => getAdministratorsByCompanyId(company.id), 
        {
            onSuccess: (data: AxiosResponse<UserDetails[]>) => {
                setAdministrators(data.data);
            },
            enabled: company.id !== 0
        }
    );

    const getEquipment = useQuery(
        ['equipment/byCompanyId', company.id],
        () => getAllEquipmentByCompanyId(company.id),
        {
            onSuccess: (data: AxiosResponse<Equipment[]>) => {
                setEquipment(data.data);
            },
            enabled: company.id !== 0
        }
    );

    const getAppointments = useQuery(
        ['appointments/byCompanyId', company.id],
        () => getAppointmentsByCompanyId(company.id),
        {
            onSuccess: (data: AxiosResponse<Appointment[]>) => {
                setAppointments(data.data);
            },
            enabled: company.id !== 0
        }
    );

    const getAddress = useQuery(
        ['address', company.addressId],
        () => getAddressById(company.addressId),
        {
            onSuccess: (data: AxiosResponse<Address>) => {
                setAddress(data.data);
            },
            enabled: company.id !== 0
        }
    );

    const deleteEquipmentMutation = useMutation(deleteEquipmentById, {
        onSuccess: () => {
            getEquipment.refetch();
            getAppointments.refetch();
        }
    });

    function setEquipForDel(id: number): void {
        setEquipForDelId(id);
        deleteEquipmentMutation.mutate(id)
    }

    useEffect(() => {
        // getLoggedUser.refetch();
    },[user, userDetails, equipForDelId, company, getLoggedUser])
    
    return (
        <div className={`${classes.container}`}>
            <Grid container spacing={2} className={`${classes.gridContainer}`}>
                <Grid item xs={12} sm={3} className={`${classes.gridItem1}`}>
                    <p className={`${classes.companyDescription}`}>{company.description}</p>
                    <p>{administrators?.length}</p>
                    {(userDetails.role.toString() === 'COMPANY_ADMIN' && company.id === userDetails.companyId) ? (
                        <Link to={`/editCompanyAdminProfile/${userDetails.id}`}>
                            <Button className={`${classes.editCompanyButton}`} size="large" variant="contained">
                                Edit Profile
                            </Button>
                        </Link>
                    ) : (
                        <p></p>
                    )}
                </Grid>

                <Grid item xs={12} sm={6} className={`${classes.gridItem2}`}>
                    <Typography className={`${classes.companyName}`} fontSize="95px" fontWeight="bold" variant="h4">{company.companyName}</Typography>
                     <p className={`${classes.companyAddress}`}>{address.street} {address.streetNumber}</p>
                     <p className={`${classes.companyAddress}`}>{address.city}, {address.country}</p>
                     <p className={`${classes.companyAddress}`}>Latitude: {address.latitude}</p>
                     <p className={`${classes.companyAddress}`}>Longitude: {address.longitude}</p>
                </Grid>

                <Grid item xs={12} sm={3} className="gridItem3">
                    <p className={`${classes.companyRating}`}>{company.rating}</p>
                    {(userDetails.role.toString() === 'COMPANY_ADMIN' && company.id === userDetails.companyId) ? (
                        <Link to={`/editCompany/${userDetails.companyId}`}>
                            <Button className={`${classes.editCompanyButton}`} size="large" variant="contained">
                                Edit Company
                            </Button>
                        </Link>
                    ) : (
                        <p></p>
                    )}
                </Grid>
            </Grid>

            {(userDetails.role.toString() === 'COMPANY_ADMIN' && company.id === userDetails.companyId) ? (
                <TableContainer sx={{ marginTop: 5}} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor:"wheat"}}>
                                <TableRow>
                                    <TableCell align="center">First Name</TableCell>
                                    <TableCell align="center">Last Name</TableCell>
                                    <TableCell align="center">Username&nbsp;</TableCell>
                                    <TableCell align="center">Email&nbsp;</TableCell>
                                    {/* <TableCell align="center">Address&nbsp;</TableCell> */}
                                    <TableCell align="center">Number&nbsp;</TableCell>
                                    <TableCell align="center">Profession&nbsp;</TableCell>
                                </TableRow>
                            </TableHead>
                        <TableBody>
                            {administrators?.map((admin) =>(
                                <TableRow
                                    key={admin.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center" component="th" scope="row">
                                        {admin.firstName}
                                    </TableCell>
                                    <TableCell align="center">{admin.lastName}</TableCell>
                                    <TableCell align="center">{admin.username}</TableCell>
                                    <TableCell align="center">{admin.email}</TableCell>
                                    {/* <TableCell align="center">{getAddressById(admin.addressId).city}</TableCell> */}
                                    <TableCell align="center">{admin.phoneNumber}</TableCell>
                                    <TableCell align="center">{admin.profession}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <p></p>
            )}

            <div className={`${classes.secondGrid}`}>
                <Grid container spacing={2} className={`${classes.secondGridContainer}`}>
                    {/* Prva kolona - prva polovina */}
                    <Grid item xs={12} sm={6} className={`${classes.secondGridItem1}`}>
                        <h1>Equipment</h1> 
                        {(userDetails.role.toString() === 'COMPANY_ADMIN' && company.id === userDetails.companyId) ? (
                            <Link to={`/createEquipment/${userDetails.companyId}`}>
                                <Button variant="contained" size="small">Create Equipment</Button>
                            </Link>
                        ) : (
                            <p></p>
                        )}

                        {equipment?.map((equip, index) =>(
                            <Card key={index} className={`${classes.equipmentCard}`} sx={{ maxWidth: 700, height: 350 }}>
                                <CardMedia
                                sx={{ height: 140 }}
                                image="https://ba.alfinemed.com/uploads/202238237/small/beaker-low-form24291268583.jpg"
                                title="Equipment XD"
                                />
                                <CardContent>
                                    <div className="left-eq-infos">
                                        <Typography gutterBottom variant="h5" component="div">
                                            {equip.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {equip.description}
                                        </Typography>
                                    </div>

                                    <div className="right-eq-infos">
                                        <Typography gutterBottom variant="h5" component="div">
                                            {equip.rating}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {equip.price}$
                                        </Typography>
                                    </div>
                                </CardContent>
                                {(userDetails.role.toString() === 'COMPANY_ADMIN' && company.id === userDetails.companyId) ? (
                                <CardActions>
                                    <Link to={`/editEquipment/${equip.id}`}>
                                        <Button variant="contained" size="small">Edit</Button>
                                    </Link>
                                    <Button onClick={() => setEquipForDel(equip.id)} variant="contained" size="small">Delete</Button>
                                </CardActions>
                                ) : (
                                    <p></p>
                                )}
                                {userDetails.role.toString() === 'USER' ? (
                                    <CardActions> 
                                        {/* <Button onClick={() => this.selectEquipment(equip)} variant="contained" size="small" disabled={equip.appointmentId !== null}>{equip.appointmentId !== null ? 'Selected' : 'Select'}</Button> */}
                                    </CardActions>
                                ) : (
                                    <p></p>
                                )}
                            </Card>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={6} className={`${classes.secondGridItem2}`}>
                        {/* Sadržaj za drugu polovinu grida */}
                        <h1>Appointments:</h1>
                        {(userDetails.role.toString() === 'COMPANY_ADMIN' && company.id === userDetails.companyId) ? (
                            <Link to={`/createAppointment/${company.id}`}>
                                <Button variant="contained" size="small">Create Appointment</Button>
                            </Link>
                        ) : (
                        <p></p>
                        )}
                        {appointments?.map((appointment, index) => (
                            <Card key={index} className={`${classes.appointmentCard}`} sx={{ maxWidth: 700, height: 350 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image="https://www.cvfht.ca/FHTfolders.php?df=640"
                                    title="Appointment"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                    {/* {appointment.adminName} {appointment.adminLastname} */}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Appointment opening time: {format(appointment.dateTime, 'dd.MM.yyyy. HH:mm')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Status: {appointment.status}
                                    </Typography>
                                </CardContent>
                                {userDetails.role.toString() === 'USER' ? (
                                    <CardActions>
                                        {appointment.isReserved === false ? (
                                            // <Button onClick={() => this.reserveAppointment(appointment)} variant="contained" size="small" disabled={props.selectedEquipment.length === 0}>Reserve</Button>
                                            <Button variant="contained" size="small" >Reserve</Button>
                                        ) : (
                                            <p className="already-reserved-p">Someone already reserved.</p>
                                        )}
                                    </CardActions>
                                ) : (
                                    <p></p>
                                )}
                            </Card>
                        ))}
                    </Grid>          
                </Grid>
            </div>
            
        </div>
    );
}