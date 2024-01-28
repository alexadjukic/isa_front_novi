import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Equipment, EquipmentType } from "../../model/equipment";
import { UserDetails, UserRole } from "../../model/user";
import { UserContext } from "../../App";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserDetailsById } from "../../services/userService";
import { AxiosResponse } from "axios";
import { getEquipmentById, updateEquipment } from "../../services/equipmentService";
import { Button, FormControl, Input, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";


export default function EquipmentForm() {
    const params = useParams();
    const userContext = useContext(UserContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState<Equipment>({id: 0, name: '', type: EquipmentType.BANDAGES, description: '', rating: 0, price: 0, companyId: 0, appointmentId: 0});
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
    });

    const equipmentMutation = useMutation(updateEquipment, {
        onSuccess: (data: AxiosResponse<Equipment>) => {
            setEquipment(data.data);
            queryClient.invalidateQueries(['equipmentById', params.id]);
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

    const equipmentByIdQuery = useQuery(
        ['equipmentById', params.id],
        () => getEquipmentById(params.id),
        {
            onSuccess: (data: AxiosResponse<Equipment>) => {
                setEquipment(data.data);
            },
            enabled: user.id !== 0
        }
    )

    useEffect(() => {
        // if(userQuery.isSuccess){
        //     equipmentByIdQuery.refetch();
        // }
    }, [user, equipment]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        equipmentMutation.mutate(equipment);
        navigate('/company/' + equipment.companyId);
    };

    const handleInputChangeSelect = (event: SelectChangeEvent<EquipmentType>) => {
        const { value } = event.target; // Ukloni 'id' jer Select element nema 'id'
        const updatedEquipment = { ...equipment, type: value as EquipmentType}; // Koristi 'type' kao ključ za ažuriranje
        setEquipment(updatedEquipment);
    };
    

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        const updatedEquipment = { ...equipment, [id]: value };
        setEquipment(updatedEquipment);
    };

    if(equipment.id === 0){
        equipmentByIdQuery.refetch()
        return <p>Loading...</p>
    }

    return(
        <div className="equipment-form">
            <form onSubmit={event =>  handleSubmit(event)}>
                <h1>Update Equipment</h1>
                <div>
                <FormControl>
                <InputLabel htmlFor="name">Equipment name</InputLabel>
                    <Input
                    id="name"
                    aria-describedby="my-helper-text"
                    value={equipment.name}
                    onChange={handleInputChange}
                    required
                    />
                </FormControl>
                </div>

                <div>
                    <FormControl variant="outlined"  margin="normal" size="small">
                    <InputLabel id="filterDropdown-label" >Type</InputLabel>
                    <br/>
                    <Select
                        labelId="filterDropdown-label"
                        id="type"
                        // label="Filter by Rating"
                        size="small"
                        style={{ width: '200px' }}
                        onChange={handleInputChangeSelect}
                        value={equipment.type}
                        >
                        
                        <MenuItem value="CLOTHES">Clothes</MenuItem>
                        <MenuItem value="BANDAGES">Bandages</MenuItem>
                        <MenuItem value="MEDS">Meds</MenuItem>
                        <MenuItem value="CRUTCHES">Crutches</MenuItem>
                        <MenuItem value="SYRINGE">Syringe</MenuItem>
                    </Select>
                    </FormControl>
                </div>

                <div>
                <FormControl>
                <InputLabel htmlFor="description">Description</InputLabel>
                    <Input
                    id="description"
                    aria-describedby="my-helper-text"
                    value={equipment.description}
                    onChange={handleInputChange}
                    required
                    />
                </FormControl>
                </div>

                <div>
                <FormControl>
                <InputLabel htmlFor="rating">Rating</InputLabel>
                    <Input
                    id="rating"
                    aria-describedby="my-helper-text"
                    value={equipment.rating}
                    onChange={handleInputChange}
                    type="number"
                    required
                    />
                </FormControl>
                </div>

                <div>
                <FormControl>
                <InputLabel htmlFor="price">Price</InputLabel>
                    <Input
                    id="price"
                    aria-describedby="my-helper-text"
                    value={equipment.price}
                    onChange={handleInputChange}
                    type="number"
                    required
                    />
                </FormControl>
                </div>
                <Button type="submit" variant="contained" color="primary">Update Equipment</Button>
                
            </form>
        </div>
    )
}