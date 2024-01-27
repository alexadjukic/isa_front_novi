import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    List,
    ListItem,
    ListItemText,
    SelectChangeEvent,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../model/company';
import { useQuery } from 'react-query';
import { searchCompanies } from '../../services/companyService';
import { AxiosResponse } from 'axios';

export default function CompanyListFilter() {
    const [searchNameInput, setSearchNameInput] = useState<string>('');
    const [searchAddressInput, setSearchAddressInput] = useState<string>('');
    const [searchedCompanies, setSearchedCompanies] = useState<Company[]>([]);
    const [selectedRating, setSelectedRating] = useState<string>('0');

    const companiesQuery = useQuery(
        ['companies', { prefix: 'a', address: 'a' }],
        () => searchCompanies('a', 'a'),
        {
            onSuccess: (data: AxiosResponse<Company[]>) => {
                setSearchedCompanies(data.data);
            },
        },
    );

    const handleNameInputChange = (
        event: ChangeEvent<HTMLInputElement>,
    ): void => {
        setSearchNameInput(event.target.value);
    };

    const handleAddressInputChange = (
        event: ChangeEvent<HTMLInputElement>,
    ): void => {
        setSearchAddressInput(event.target.value);
    };

    const handleSelectChange = (event: SelectChangeEvent<string>): void => {
        setSelectedRating(event.target.value);
        setSearchedCompanies(
            selectedRating === '0'
                ? searchedCompanies
                : searchedCompanies.filter(
                      company =>
                          company.rating >= Number(selectedRating) &&
                          company.rating < Number(selectedRating) + 1,
                  ),
        );
        setSelectedRating(selectedRating);
    };

    const handleSearch = () => {
        companiesQuery.refetch();
    };

    if (companiesQuery.isError) return <div>Error fetching companies</div>;

    return (
        <Box p={3}>
            <h1>Company Explorer</h1>
            <TextField
                label="Search by Name"
                variant="outlined"
                fullWidth
                size="small"
                style={{ width: '200px' }}
                margin="normal"
                value={searchNameInput}
                onChange={handleNameInputChange}
            />
            <TextField
                label="Search by Address"
                variant="outlined"
                fullWidth
                size="small"
                style={{ width: '200px', marginLeft: '20px' }}
                margin="normal"
                value={searchAddressInput}
                onChange={handleAddressInputChange}
            />
            <FormControl
                variant="outlined"
                fullWidth
                margin="normal"
                size="small">
                <InputLabel id="filterDropdown-label">
                    Filter by Rating
                </InputLabel>
                <Select
                    labelId="filterDropdown-label"
                    id="filterDropdown"
                    label="Filter by Rating"
                    size="small"
                    style={{ width: '200px' }}
                    onChange={handleSelectChange}
                    value={selectedRating}>
                    <MenuItem value="0">All Ratings</MenuItem>
                    <MenuItem value="5">5 stars</MenuItem>
                    <MenuItem value="4">4 stars</MenuItem>
                    <MenuItem value="3">3 stars</MenuItem>
                    <MenuItem value="2">2 stars</MenuItem>
                    <MenuItem value="1">1 stars</MenuItem>
                </Select>
            </FormControl>
            <Button
                style={{ marginTop: '10px' }}
                variant="contained"
                color="primary"
                onClick={handleSearch}>
                Search
            </Button>
            <Box mt={3}>
                <h2>Company List</h2>
                <List>
                    {searchedCompanies.map(company => (
                        <Link
                            to={`/company/${company.id}`}
                            key={`${company.id}`}>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <strong>{company.companyName}</strong>
                                    }
                                    secondary={`Address: ${company.address} | Rating: ${company.rating}`}
                                />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
