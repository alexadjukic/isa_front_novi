import {
    Typography,
    Box,
    FormControl,
    InputLabel,
    Input,
    Button,
} from '@mui/material';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
    getUserDetailsById,
    updateUserDetails,
} from '../../services/userService';
import { UserDetails, UserRole } from '../../model/user';
import { AxiosResponse } from 'axios';
import classes from './UserProfile.module.css';
import { UserContext } from '../../App';
import { getAddressById } from '../../services/addressService';
import { Address } from '../../model/address';

export default function UserProfile() {
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
    const [address, setAddress] = useState<string>('');
    const userContext = useContext(UserContext);
    const queryClient = useQueryClient();

    const userMutation = useMutation(updateUserDetails, {
        onSuccess: (data: AxiosResponse<UserDetails>) => {
            setUser(data.data);
            queryClient.invalidateQueries(['users', userContext.user.id]);
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
            staleTime: Infinity,
        },
    );

    const addressQuery = useQuery(
        ['address', user.addressId],
        () => getAddressById(user.addressId),
        {
            onSuccess: (data: AxiosResponse<Address>) => {
                const { city, country, street, streetNumber } = data.data;
                setAddress(`${city}, ${country}, ${street} ${streetNumber}`);
            },
            enabled: user.addressId !== 0,
        },
    );

    useEffect(() => {
        if (userQuery.isSuccess)
            setUser(userQuery.data.data);
    }, [userQuery.isSuccess]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        userMutation.mutate(user);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        const updatedUser = { ...user, [id]: value };
        setUser(updatedUser);
    };

    if (userQuery.isLoading || addressQuery.isLoading)
        return <div>Loading...</div>;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
                padding: '20px',
            }}>
            <Typography
                variant="h4"
                gutterBottom
                style={{ marginBottom: '50px' }}>
                User profile
            </Typography>
            <form onSubmit={event => handleSubmit(event)}>
                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="firstName">First Name</InputLabel>
                        <Input
                            id="firstName"
                            aria-describedby="my-helper-text"
                            value={user.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                </Box>

                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="lastName">Last Name</InputLabel>
                        <Input
                            id="lastName"
                            aria-describedby="my-helper-text"
                            value={user.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                </Box>

                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input
                            id="username"
                            aria-describedby="my-helper-text"
                            value={user.username}
                            disabled
                        />
                    </FormControl>
                </Box>

                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            id="email"
                            type="email"
                            aria-describedby="my-helper-text"
                            value={user.email}
                            disabled
                        />
                    </FormControl>
                </Box>

                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="address">Address</InputLabel>
                        <Input
                            id="address"
                            aria-describedby="my-helper-text"
                            value={address}
                            disabled
                            required
                        />
                    </FormControl>
                </Box>

                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="phoneNumber">
                            Phone Number
                        </InputLabel>
                        <Input
                            id="phoneNumber"
                            aria-describedby="my-helper-text"
                            value={user.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                </Box>

                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="profession">Profession</InputLabel>
                        <Input
                            id="profession"
                            aria-describedby="my-helper-text"
                            value={user.profession}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                </Box>

                <Box className={`${classes.boxContainer}`}>
                    <FormControl>
                        <InputLabel htmlFor="profession">Penalty points</InputLabel>
                        <Input
                            id="profession"
                            aria-describedby="my-helper-text"
                            value={user.penaltyPoints}
                            onChange={handleInputChange}
                            required
                            disabled
                        />
                    </FormControl>
                </Box>
                <Box>
                    <Button type="submit" variant="contained" color="primary">
                        Update user
                    </Button>
                </Box>
                {userMutation.isSuccess && <div>Update successful</div>}
            </form>
        </div>
    );
}
