import {AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Menu as MenuIcon} from "@mui/icons-material";
import Logo from "../inline-components/logo";
import {themeModeContext} from "../../utils/context";
import {makeStyles} from "@mui/styles";

const pages = ['Dashboard', 'Calculator', 'Workers', 'Earnings', 'Settings'];

const useStyles: any = makeStyles((theme: any) => ({
    header: {
        backgroundColor: "#043180",
        height: "55px",
        "@media (min-width: 1980px)": {
            height: "80px"
        },
        position: "sticky",
        top: 0,
        zIndex: 1200
    },
    navLink: {
        color: "var(--new-text-color)!important",
        fontFamily: "var(--font-body)!important",
        transition: "all ease-in 200ms!important",
        position: "relative",
        "@media (min-width: 1980px)": {
            fontSize: 24,
        },
        "&:hover": {
            color: "#CEA716!important",
        },
        "&::after": {
            content: "''",
            width: "95%",
            height: 8,
            position:"absolute",
            left:0,
            right:0,
            bottom:-5,
            backgroundColor: "#CEA716",
            borderRadius: 10,
            opacity: 0,
            margin: "auto",
            transition: "all ease-in 200ms!important",
        },
        "&:hover::after": {
            opacity: 1,
        },
    },
    activeNavLink: {
        color: "#CEA716!important",
        fontWeight: "bold",
        "&::after": {
            opacity: "1!important"
        },
    }
}));

const Navigation = () => {
    const router = useRouter();
    const {mode} = useContext(themeModeContext);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const styles = useStyles();

    const handleOpenNavMenu = (event: any) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const checkActivation = (name:string) => {
          if(router.isReady){
              if(name.toLowerCase() == 'earnings'){
                  return router.pathname.startsWith(`/${name.toLowerCase()}`) || router.pathname.startsWith(`/payments`);
              }else {
                  return router.pathname.startsWith(`/${name.toLowerCase()}`);
              }
          }else {
              return false;
          }
    };

    return (
        <AppBar className={styles.header} position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <Button
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            startIcon={<MenuIcon/>}
                        >
                            Menu
                        </Button>
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
                                display: {xs: 'block', md: 'none'},
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
                    <Box justifyContent={"start"} sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => {
                                    router.push(`/${page.toLowerCase()}`);
                                    handleCloseNavMenu();
                                }}
                                sx={{my: 2, display: 'block',mt:"10px"}}
                                className={`${styles.navLink} ${checkActivation(page) ? styles.activeNavLink : ''}`}
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
