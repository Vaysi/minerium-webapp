import type {NextPage} from 'next'
import {Box, Button, CircularProgress, Container, Divider, Grid, TextField, Typography} from "@mui/material";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import {makeStyles} from "@mui/styles";
import React, {useContext, useEffect, useState} from "react";
import {userContext} from "../../utils/context";
import {$$resendVerification, $$resetPassword, $$verifyEmail} from "../../utils/api";
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

const Forget: NextPage = () => {
    const styles = useStyles();
    const [email, setEmail] = useState<string>('');
    const [confirmed,setConfirmed] = useState<boolean>(false);

    const resetPass = () => {
        $$resetPassword(email).then(res => {
            setConfirmed(true);
        })
    };

    return (
        <Grid container>
            <Header/>
            <Container sx={{maxWidth: {xs: "xl", md: "md", xl: "sm"}}}>
                <CustomCard titleProps={{title: confirmed ? "Check Your Email" : "Reset Password"}}>
                    {
                        confirmed ? (
                            <>
                                <Typography>
                                    An email has been sent to you containing a link. Please open that
                                    link in order to reset your password.
                                </Typography>
                                <br />
                                <Typography>
                                    If you haven't received an email please make sure you have entered
                                    the correct email address. If the email address is correct, please
                                    check your "spam" folder and wait for the email to arrive.
                                </Typography>
                                <br />
                                <Typography align={"center"}>
                                    Email sent to: <br />
                                    {email}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Box>
                                    <TextField
                                        value={email}
                                        defaultValue={email}
                                        id="email"
                                        label="Email Address"
                                        fullWidth
                                        sx={{mb: 2}}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </Box>
                                <Box display={"flex"} justifyContent={"end"}>
                                    <Button disabled={email?.length < 5} onClick={resetPass} variant={"contained"} color={"primary"}>
                                        Submit
                                    </Button>
                                </Box>
                            </>
                        )
                    }
                </CustomCard>
            </Container>
            <Footer/>
        </Grid>
    );
};

export default ProtectedRoute(Forget, true);
