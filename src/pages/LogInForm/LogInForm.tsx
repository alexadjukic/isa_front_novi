import { Button, FormControl, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import classes from './LogInForm.module.css';
import { useMutation } from 'react-query';
import { logIn } from '../../services/authorizationService';
import { AxiosResponse } from 'axios';
import {
    AuthenticationRequest,
    AuthenticationResponse,
} from '../../model/authentication';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function LogInForm() {
    const navigate = useNavigate();

    const { setItem: setToken } = useLocalStorage('jwtToken');

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // validation
    const [isUsernameEmpty, setIsUsernameEmpty] = useState<boolean>(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);
    const [areCredentialsInvalid, setAreCredentialsInvalid] =
        useState<boolean>(false);

    const logInMutation = useMutation(logIn, {
        onSuccess: (data: AxiosResponse<AuthenticationResponse>) => {
            setToken(data.data.token);
            navigate('/');
        },
        onError: () => {
            setAreCredentialsInvalid(true);
            setUsername('');
            setPassword('');
        },
    });

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        setAreCredentialsInvalid(false);
        event.target.value
            ? setIsUsernameEmpty(false)
            : setIsUsernameEmpty(true);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setAreCredentialsInvalid(false);
        event.target.value
            ? setIsPasswordEmpty(false)
            : setIsPasswordEmpty(true);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const credentials: AuthenticationRequest = { username, password };
        logInMutation.mutate(credentials);
    };

    return (
        <div className={`${classes.logInFormContainer}`}>
            <Typography
                variant="h4"
                gutterBottom
                style={{ marginBottom: '50px' }}>
                Log In
            </Typography>
            <form
                onSubmit={handleSubmit}
                className={`${classes.formContainer}`}>
                <FormControl error={!username}>
                    <TextField
                        label="username"
                        error={isUsernameEmpty || areCredentialsInvalid}
                        helperText={
                            areCredentialsInvalid
                                ? 'Invalid credentials'
                                : isUsernameEmpty
                                  ? 'Cannot be empty'
                                  : ''
                        }
                        onChange={handleUsernameChange}
                    />
                </FormControl>

                <FormControl error={!password}>
                    <TextField
                        label="password"
                        error={isPasswordEmpty || areCredentialsInvalid}
                        helperText={
                            areCredentialsInvalid
                                ? 'Invalid credentials'
                                : isPasswordEmpty
                                  ? 'Cannot be empty'
                                  : ''
                        }
                        onChange={handlePasswordChange}
                        type="password"
                    />
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Log In
                </Button>
            </form>
        </div>
    );
}
