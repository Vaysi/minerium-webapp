import type {NextPage} from 'next'
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    TextField
} from "@mui/material";
import Header from "../../components/header/header";
import {Google,} from "@mui/icons-material";
import Footer from "../../components/footer/footer";
import {makeStyles} from "@mui/styles";
import React, {useContext, useEffect, useState} from "react";
import {isLoggedIn} from "axios-jwt";
import {themeModeContext, userContext} from "../../utils/context";
import {$$userRegister} from "../../utils/api";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import ProtectedRoute from "../../components/ProtectedRoute";
import CustomCard from "../../components/inline-components/card";

const useStyles: any = makeStyles((theme: any) => ({
    button: {
        textTransform: "none",
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: 16
    },
    input: {
        backgroundColor: "#F5F5F7",
        boxShadow: "inset 0px 1px 10px rgba(0, 0, 0, 0.25)",
        marginTop: "20px!important"
    },
    commonBtn:{
        width: "310px"
    },
    google: {
        boxShadow: "0px 10px 10px -2px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#F5F5F7!important",
        borderRadius: "5px!important",
        border: "none!important"
    }
}));

const Register: NextPage = () => {
    const styles = useStyles();
    const router = useRouter();
    const {user, setUser} = useContext(userContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {mode} = useContext(themeModeContext);
    const ready = () => {
        if (email.length > 4 && username.length > 4 && password == confirmPassword && agreed) {
            return true;
        } else {
            return false;
        }
    };

    const onSubmit = () => {
        setLoading(true);
        $$userRegister(email, password, confirmPassword, username).then(response => {
            let urlParams = new URLSearchParams({
                email: email,
                expireDate: response.data.expireDate
            }).toString();
            setTimeout(() => {
                router.push('/auth/verify?' + urlParams);
            }, 1000);
            setUser({...user, email, username});
            setLoading(false);
        }).catch(reason => {
            let close = reason.data == 'TRY_LOGIN' ? 7000 : 5000;
            if ('message' in reason) {
                toast.error(reason.message, {autoClose: close});

                if (reason.data == 'TRY_LOGIN') {
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 7500);
                }

                if (reason.data == 'NOT_VERIFIED') {
                    let urlParams = new URLSearchParams({
                        email: email,
                        expireDate: reason.data.expireDate
                    }).toString();
                    setTimeout(() => {
                        router.push('/auth/verify?' + urlParams);
                    }, 1000);
                }
            }
            setLoading(false);
        });

    };
    return (
        <Grid container>
            <Header/>
            <Container sx={{maxWidth: {xs: "xl", md: "sm"}}}>
                <CustomCard titleProps={{title: "Register"}}>
                    <Box className={"noBorder"}>
                        <TextField
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            id="email"
                            label="Email"
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            classes={{root: styles.input}}
                        />
                        <TextField
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            id="username"
                            label="Username"
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            classes={{root: styles.input}}
                            defaultValue={""}
                            inputProps={{
                                autocomplete: 'new-username',
                                form: {
                                    autocomplete: 'off',
                                },
                            }}
                        />
                        <TextField
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            id="password"
                            label="Password"
                            type={!showPassword ? 'password' : 'text'}
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            autoComplete={"off"}
                            classes={{root: styles.input}}
                            defaultValue={""}
                            inputProps={{
                                autocomplete: 'new-password',
                                form: {
                                    autocomplete: 'off',
                                },
                            }}
                        />
                        <TextField
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            id="repeat_password"
                            label="Confirm Password"
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            type={!showPassword ? 'password' : 'text'}
                            focused
                            classes={{root: styles.input}}
                            defaultValue={""}
                            inputProps={{
                                autocomplete: 'new-repeat-password',
                                form: {
                                    autocomplete: 'off',
                                },
                            }}
                        />
                        <FormControl>
                            <FormControlLabel label={(
                                <>
                                    <a target="_blank" rel={"noreferrer"} style={{color: mode =='dark' ? "#fff" : "#043386"}}
                                       href="https://minerium.com/terms-of-services/">Accept User Agreement</a>.</>
                            )} control={<Checkbox style={{color: mode == 'dark' ? "#fff" : "#000"}} defaultChecked onClick={() => setAgreed(!agreed)}
                                                  checked={agreed}/>}/>
                        </FormControl>
                        <Grid container textAlign={"center"}>
                            <Grid item xs={12}>
                                <Button onClick={onSubmit} className={`${styles.button} ${styles.commonBtn}`} variant={"contained"}
                                        startIcon={loading ? <CircularProgress size={20}/> : ''}
                                        disabled={!ready() || loading}>
                                    Register
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{mt: 2, mb: 2}}/>
                                <Button className={`${styles.commonBtn} ${styles.google}`} color={"primary"} variant="outlined">
                                    <img src={"/assets/images/google.svg"} style={{width:25,height:25,marginRight:10,paddingTop:4,paddingBottom:4}}  alt={"Google"}/>
                                    Sign Up With Google
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CustomCard>
            </Container>
            <Footer/>
        </Grid>
    );
};

export default ProtectedRoute(Register, true);
