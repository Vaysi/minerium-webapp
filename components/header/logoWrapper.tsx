import {Box, Button, Container, Grid} from "@mui/material";
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import Logo from "../inline-components/logo";
import {themeModeContext, userContext} from "../../utils/context";
import {makeStyles} from "@mui/styles";
import {Person} from "@mui/icons-material";

const useStyles: any = makeStyles((theme: any) => ({
    header: {
        backgroundColor: "var(--bg-color)",
        width: "100%"
    },
    user: {
        background: "radial-gradient(135.23% 135.23% at 0% 120.45%, #D4E2F4 0%, #B3CEF2 100%)",
        border: "1px solid rgba(212, 226, 244, 0.18)",
        boxShadow: "6px 12px 20px rgba(0, 0, 0, 0.25)",
        borderRadius: "15px!important",
        padding: "10px!important",
        color: "var(--primary)",
        fontFamily: "var(--font-header)!important",
        fontWeight: "500!important",
        "[data-theme=dark] &": {
            background: "radial-gradient(135.23% 135.23% at 0% 120.45%, #1E1E1E 0%, rgba(30, 30, 30, 0.42) 100%)",
            border: "1px solid rgba(212, 226, 244, 0.81)!important",
            color: "#D4E2F4"
        }
    }
}));

const LogoWrapper = () => {
    const router = useRouter();
    const {mode} = useContext(themeModeContext);
    const {user} = useContext(userContext);
    const styles = useStyles();

    return (
        <div className={styles.header}>
            <Container maxWidth="xl">
                <Grid container sx={{py: 2}}>
                    <Grid item sm={6} xs={12}>
                        <Box sx={{flexGrow: 1, cursor: "pointer", mr: 2, display: {xs: 'flex'}}}
                             onClick={() => router.push("/")}>
                            <Logo mode={mode} styles={{maxHeight: 45,width: 240}}/>
                        </Box>
                    </Grid>
                    <Grid item sm={6} xs={12} textAlign={"right"}>
                        {
                            user && user.loggedIn &&
                            (
                                <Button className={styles.user} onClick={() => router.push('/profile')} startIcon={<Person />}>
                                    {user.username}
                                </Button>
                            )
                        }
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default LogoWrapper;
