import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {useContext, useState} from "react";
import {useRouter} from "next/router";
import {Menu as MenuIcon} from "@mui/icons-material";

const pages = ['Dashboard', 'Calculator', 'Workers', 'Earnings', 'Settings'];
import Link from "next/link";
import Logo from "../inline-components/logo";
import {themeModeContext} from "../../utils/context";
import {makeStyles} from "@mui/styles";

const useStyles:any = makeStyles((theme:any) => ({
    header: {
        backgroundColor: "var(--bg-color)"
    },
    navLink: {
        color: "var(--text-color)",
        fontFamily: "var(--font-body)",
        transition: "all ease-in 200ms",
        "&:hover": {
            color: "var(--accent-const)"
        }
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
    return (
        <AppBar className={styles.header} position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1, cursor: "pointer", mr: 2, display: {xs: 'none', md: 'flex'}}}>
                        <Link href={"/"} passHref>
                            <Logo mode={mode} style={{maxHeight: 45}}/>
                        </Link>
                    </Box>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
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
                    <Box
                        sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}, justifyContent: "end"}}
                    >
                        <Link href={"/"} passHref>
                            <Logo mode={mode} style={{maxHeight: 45}}/>
                        </Link>
                    </Box>
                    <Box justifyContent={"end"} sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => {
                                    router.push(page.toLowerCase());
                                    handleCloseNavMenu();
                                }}
                                sx={{my: 2, display: 'block'}}
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
