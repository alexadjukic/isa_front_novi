import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserDetails } from "../../model/user";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { getUsersThatReservedAppointment } from "../../services/userService";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";


export default function CustomerList() {
    const params = useParams();
    const [users, setUsers] = useState<UserDetails[]>([]);

    const usersQuery = useQuery(
        ['users', params.companyId],
        () => getUsersThatReservedAppointment(params.companyId),
        {
            onSuccess: (data: AxiosResponse<UserDetails[]>) => {
                setUsers(data.data);
            }
        }
    )

    useEffect(() => {
        // console.log(users);
    },[users])

    if(usersQuery.isLoading){
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1 style={{marginLeft: 350}}>LIST OF USERS THAT RESERVED ATLEAST ONE APPOINTMENT IN MY COMPANY</h1>
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
                        {users.map((u) =>(
                            <TableRow
                                key={u.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center" component="th" scope="row">
                                    {u.firstName}
                                </TableCell>
                                <TableCell align="center">{u.lastName}</TableCell>
                                <TableCell align="center">{u.username}</TableCell>
                                <TableCell align="center">{u.email}</TableCell>
                                {/* <TableCell align="center">{getAddressById(admin.addressId).city}</TableCell> */}
                                <TableCell align="center">{u.phoneNumber}</TableCell>
                                <TableCell align="center">{u.profession}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}