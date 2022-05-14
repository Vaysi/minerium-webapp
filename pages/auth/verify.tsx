import type {NextPage} from 'next'
import {Box, Button, CircularProgress, Container, Divider, Grid, TextField, Typography} from "@mui/material";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import {makeStyles} from "@mui/styles";
import React, {useContext, useEffect, useState} from "react";
import {userContext} from "../../utils/context";
import {$$resendVerification, $$verifyEmail} from "../../utils/api";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import CustomCard from "../../components/inline-components/card";
import useCountDown from 'react-countdown-hook';
import {msToHMS} from "../../utils/functions";
import ProtectedRoute from "../../components/ProtectedRoute";

const useStyles: any = makeStyles((theme: any) => ({
    cardHeader: {
        backgroundColor: "#043180",
        color: "#fff"
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)"
    },
    button: {
        textTransform: "none",
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: 16
    }
}));

const Verify: NextPage = () => {
    const styles = useStyles();
    const router = useRouter();
    const {email: userEmail} = router.query;
    const {user, setUser} = useContext(userContext);
    const [email, setEmail] = useState<string>(userEmail as string || '');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, {start, pause, resume, reset}] = useCountDown(565000, 1000);

    useEffect(() => {
        start();
        setEmail(userEmail as string || '');
    }, [userEmail]);

    const restart = React.useCallback(() => {
        resend();
        start();
    }, []);

    useEffect(() => {
        if (router.isReady && userEmail == undefined || userEmail == '') {
            router.push('/auth/login');
        }
    }, [router.isReady]);

    const resend = () => {
        setLoading(true);
        $$resendVerification(email).then(res => {
            toast.success('We sent you a new verification token. Please check your email and if it\'s not there, please check the spam folder');
            restart();
            setLoading(false);
        });
    };

    const verify = () => {
        setLoading(true);
        $$verifyEmail(email, token).then(res => {
            toast.success("You're Account Successfully Verified , Now You Can Login to your Account");
            setUser({...res.data, loggedIn: true});
            router.push('/');
            setLoading(false);
        });
    };

    return (
        <Grid container>
            <Header/>
            <Container sx={{maxWidth: {xs: "xl", md: "md", xl: "sm"}}}>
                <CustomCard titleProps={{title: "Verify Your Email"}}>
                    <Box>
                        <TextField
                            disabled
                            value={email}
                            defaultValue={email}
                            id="email"
                            label="Email Address"
                            fullWidth
                            sx={{mb: 2}}
                        />
                        <TextField
                            onChange={(e) => setToken(e.target.value)}
                            label="Token"
                            fullWidth
                            sx={{mb: 2}}
                        />
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Button startIcon={loading ? <CircularProgress size={20}/> : ''} onClick={verify}
                                disabled={token.length < 2 || loading} variant={"contained"} color={"primary"}>
                            Validate
                        </Button>
                        <Button disabled={timeLeft > 0 || loading} onClick={restart} variant={"contained"}
                                color={"primary"} startIcon={(
                            msToHMS(timeLeft)
                        )}>
                            Resend Email
                        </Button>
                    </Box>
                    <Divider sx={{my: 2}}/>
                    <Typography>
                        We automatically send a verification email to the email address you used to sign up for your
                        account, but you can resend the verification email if you didn&apos;t receive it.
                    </Typography>
                </CustomCard>
            </Container>
            <Footer/>
        </Grid>
    );
};

Verify.getInitialProps = async (ctx) => {
    let {email} = ctx.query;
    if (!email && ctx && ctx.res) {
        ctx.res.writeHead(302, {Location: '/'});
    }

    return {};
};

export default ProtectedRoute(Verify, true);
