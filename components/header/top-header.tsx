import {Button, Container, Grid, IconButton} from "@mui/material";
import {
    DarkModeOutlined,
    AccountCircleOutlined,
    LightModeOutlined,
    Logout,
    Login,
    AddCircleOutlined
} from "@mui/icons-material";
import {useContext} from "react";
import {themeModeContext, userContext} from "../../utils/context";
import {useRouter} from "next/router";
import {makeStyles} from "@mui/styles";
import {clearAuthTokens} from "axios-jwt";
import {setCookie} from "../../utils/functions";

const useStyles: any = makeStyles((theme: any) => ({
    topHeader: {
        backgroundColor: "var(--header-bg)",
        borderBottom: "3px solid var(--accent-const)",
        width: "100%",
    },
    themeMode: {
        color: "#fff!important",
        opacity: 0.6,
        transition: "all ease-in 200ms!important",
        "&:hover": {
            opacity: 1
        }
    },
    active: {
        opacity: 1,
    },
    topHeaderLinks: {
        color: "#fff!important",
        textDecoration: "none",
        opacity: 0.6,
        transition: "all ease-in 200ms!important",
        "&:hover": {
            opacity: 1
        }
    }
}));

const TopHeader = () => {
    const {mode, setMode} = useContext(themeModeContext);
    const {user, setUser} = useContext(userContext);
    const router = useRouter();
    const styles = useStyles();

    const logout = () => {
        clearAuthTokens();
        setUser({...user,loggedIn:false});
        router.push('/auth/login');

    };

    return (
        <div className={styles.topHeader}>
            <Container maxWidth={"xl"}>
                <Grid container>
                    <Grid item xs={4} sm={6} sx={{textAlign:{xs:"left"}}}>
                        <IconButton className={`${styles.themeMode} ${mode == 'light' ? styles.active : ''}`}
                                    aria-label="light mode" component="span" onClick={() => {
                            setMode('light')
                            setCookie('theme','light',999999);
                        }}>
                            <LightModeOutlined/>
                        </IconButton>
                        <IconButton className={`${styles.themeMode} ${mode == 'dark' ? styles.active : ''}`}
                                    aria-label="dark mode" component="span" onClick={() => {
                                        setMode('dark')
                                        setCookie('theme','dark',999999);
                                    }}>
                            <DarkModeOutlined/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={8} sm={6} sx={{textAlign:{xs:"right"}}}>
                        {
                            user?.loggedIn ? (
                                <>
                                    <Button onClick={() => logout()}
                                            className={styles.topHeaderLinks}
                                            startIcon={<Logout/>}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => router.push('/auth/login')} className={styles.topHeaderLinks}
                                            startIcon={<Login />} sx={{mr: 2}}>
                                        Login
                                    </Button>
                                    <Button onClick={() => router.push('/auth/register')}
                                            className={styles.topHeaderLinks} startIcon={<AddCircleOutlined/>}>
                                        Register
                                    </Button>
                                </>
                            )
                        }
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default TopHeader;
