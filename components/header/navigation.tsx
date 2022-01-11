import styles from "../../styles/Header.module.css";
import {AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import {useState} from "react";
import {useRouter} from "next/router";
import {Menu as MenuIcon} from "@mui/icons-material";
const pages = ['Dashboard', 'Calculator', 'Workers', 'Earnings', 'Settings'];
import Link from "next/link";
const Navigation = () => {
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event:any) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    return (
        <AppBar color={"default"} position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1,cursor:"pointer", mr: 2, display: { xs: 'none', md: 'flex' } }}>
                        <Link href={"/"}>
                            <img src={"/assets/images/light-logo.svg"} alt={"minerium logo"} />
                        </Link>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
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
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={() => {
                                    router.push(page.toLowerCase());
                                    handleCloseNavMenu();
                                }}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        <img src={"/assets/images/light-logo.svg"} alt={"minerium logo"} />
                    </Typography>
                    <Box  justifyContent={"end"} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => {
                                    router.push(page.toLowerCase());
                                    handleCloseNavMenu();
                                }}
                                sx={{ my: 2, display: 'block' }}
                                className={styles.navLink}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navigation;
