import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { UserRole } from '../../model/user';
import { UserContext } from '../../App';

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const [pages, setPages] = useState<string[]>([]);
    const [settings, setSettings] = useState<string[]>([]);

    const { removeItem: removeToken } = useLocalStorage('jwtToken');
    const userContext = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        switch (userContext.user.role) {
            case UserRole.USER:
                setSettings(['Profile', 'LogOut']);
                setPages(['Logged in']);
                break;
            case UserRole.COMPANY_ADMIN:
                setSettings(['Profile', 'LogOut']);
                setPages(['Logged in']);
                break;
            case UserRole.SYSTEM_ADMIN:
                setSettings(['Profile', 'LogOut']);
                setPages(['Logged in']);
                break;
            case UserRole.UNAUTHENTICATED:
                setSettings(['LogIn', 'Register']);
                setPages(['Unauthorized']);
                break;
            // to-do: ovde dodate dugmice koje zelite da vam se prikazuju u odnosu na to koji je korisnik ulogovan
            // dugme automatski rutira na stranicu koja ima isti naziv kao i dugme samo malim slovima i "-" umesto razmaka (Emergency Appointments => /emergency-appointments)
        }
    }, [userContext]);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (setting: string) => {
        switch (setting) {
            case 'LogIn':
                navigate('/login');
                break;
            case 'Register':
                navigate('/register');
                break;
            case 'LogOut':
                removeToken();
                userContext.dispatch({ type: 'LogOut' });
                navigate('/');
                break;
            case 'Profile':
                navigate('/profile');
        }
        setAnchorElUser(null);
    };

    function handleMenuItemClick(page: string) {
        navigate(`${page.toLowerCase().replace(' ', '-')}`);
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon
                        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                        LOGO
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}>
                            {pages.map(page => (
                                <MenuItem
                                    key={page}
                                    onClick={() => handleMenuItemClick(page)}>
                                    <Typography textAlign="center">
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon
                        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                        LOGO
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}>
                        {pages.map(page => (
                            <Button
                                key={page}
                                onClick={() => handleMenuItemClick(page)}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                }}>
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/2.jpg"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>
                            {settings.map(setting => (
                                <MenuItem
                                    key={setting}
                                    onClick={() =>
                                        handleCloseUserMenu(setting)
                                    }>
                                    <Typography textAlign="center">
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
