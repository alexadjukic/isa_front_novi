import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    SelectChangeEvent,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../model/company';
import { useQuery } from 'react-query';
import { searchCompanies } from '../../services/companyService';
import { AxiosResponse } from 'axios';

export default function CompanyList() {
    const [searchNameInput, setSearchNameInput] = useState<string>('');
    const [searchAddressInput, setSearchAddressInput] = useState<string>('');
    const [searchedCompanies, setSearchedCompanies] = useState<Company[]>([]);
    const [selectedRating, setSelectedRating] = useState<string>('0');
    const [sortBy, setSortBy] = useState<string>('name');

    const companiesQuery = useQuery(
        ['companies', { prefix: searchNameInput, address: '' }],
        () => searchCompanies(searchNameInput, ''),
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
        const newRating = event.target.value;
        setSelectedRating(event.target.value);
        setSearchedCompanies(
            newRating === '0'
                ? searchedCompanies
                : searchedCompanies.filter(
                      company =>
                          company.rating >= Number(newRating) &&
                          company.rating < Number(newRating) + 1,
                  ),
        );
    };

    if (companiesQuery.isError) return <div>Error fetching companies</div>;

    const handleSortByChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value);
        const sortBy = event.target.value;

        const sortedCompanies = [...searchedCompanies];

        sortedCompanies.sort((a, b) => {
            if (sortBy === 'name') {
                return a.companyName.localeCompare(b.companyName);
            }
            else if (sortBy === 'rating') {
                return b.rating - a.rating;
            }

            return 0;
        });

        setSearchedCompanies(sortedCompanies);
    }

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
            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Sort by:</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={sortBy}
                    onChange={handleSortByChange}
                >
                    <FormControlLabel value="name" control={<Radio />} label="Name" />
                    <FormControlLabel value="city" control={<Radio />} label="City" />
                    <FormControlLabel value="rating" control={<Radio />} label="Rating" />
                </RadioGroup>
            </FormControl>
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
                                    secondary={`Address: ${company.addressId} | Rating: ${company.rating}`}
                                />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
