import { useContext, useState } from "react";
import { UserDetails, UserRole } from "../../model/user";
import { Appointment } from "../../model/appointment";
import { UserContext } from "../../App";
import { getUserDetailsById } from "../../services/userService";
import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth'

export default function CompanyFullCalendar() {
    const userContext = useContext(UserContext);
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

    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const userQuery = useQuery(
        ['loggedUser', userContext.user.id],
        () => getUserDetailsById(userContext.user.id),
        {
            onSuccess: (data: AxiosResponse<UserDetails>) => {
                setUser(data.data);
            },
            enabled: userContext.user.id !== 0,
            // staleTime: Infinity,
        },
    );

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
                initialView="multiMonthYear"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
                }}
            />
        </div>
    )
}