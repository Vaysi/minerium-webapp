import type {NextPage} from 'next'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Divider,
    Grid,
    TextField
} from "@mui/material";
import Header from "../../components/header/header";
import PageTitle from "../../components/inline-components/page-title";
import {Google, Login as LoginIcon} from "@mui/icons-material";
import Footer from "../../components/footer/footer";
import {makeStyles} from "@mui/styles";
import React, {useContext, useEffect, useState} from "react";
import {$$userLogin} from "../../utils/api";
import {toast} from "react-toastify";
import {isLoggedIn, setAuthTokens} from "axios-jwt";
import {themeModeContext, userContext} from "../../utils/context";
import ProtectedRoute from "../../components/ProtectedRoute";
import CustomCard from "../../components/inline-components/card";

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

const Login: NextPage = () => {
    const styles = useStyles();
    const {user,setUser} = useContext(userContext);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {mode} = useContext(themeModeContext);

    const onSubmit = () => {
        setLoading(true);
        $$userLogin(identifier,password).then(response => {
            setAuthTokens({
                accessToken: response.data.user.token,
                refreshToken: response.data.user.token,
            });
            setUser({...response.data.user,loggedIn: true});
            setLoading(false);
        }).catch(reason => {
            toast.error('Wrong Credentials !');
            setLoading(false);
        })
    };


    return (
        <Grid container>
            <Header/>
            <Container sx={{maxWidth: {xs: "xl", md: "md", xl: "sm"}}}>
                <CustomCard titleProps={{title:"Login"}}>
                    <Box className={"noBorder"}>
                        <form noValidate>
                        <TextField
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            id="identifier"
                            label="Email/Username"
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            classes={{root: styles.input}}
                            defaultValue={""}
                            inputProps={{
                                autocomplete: 'new-user',
                                form: {
                                    autocomplete: 'off',
                                },
                            }}
                        />
                        <TextField
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type={"password"}
                            id="password"
                            label="Password"
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            classes={{root: styles.input}}
                            defaultValue={""}
                            inputProps={{
                                autocomplete: 'new-pass',
                                form: {
                                    autocomplete: 'off',
                                },
                            }}
                        />
                        </form>
                        <Grid container>
                            <Grid item xs={12}>
                                <Button sx={{color: mode == 'dark' ? "#fff!important" : undefined}} className={styles.button} style={{paddingLeft: 5}}>
                                    Forgot Password ?
                                </Button>
                            </Grid>
                            <Grid justifyContent={"end"} style={{textAlign: "center"}} item xs={12}>
                                <Button onClick={onSubmit} className={`${styles.button} ${styles.commonBtn}`} variant={"contained"} startIcon={loading ? <CircularProgress size={20} /> : ''} disabled={loading}>
                                    Login
                                </Button>
                            </Grid>
                            <Grid item xs={12} textAlign={"center"}>
                                <Divider sx={{mt: 2, mb: 2}}/>
                                <Button className={`${styles.commonBtn} ${styles.google}`} color={"primary"} variant="outlined">
                                    <img src={"/assets/images/google.svg"} style={{width:25,height:25,marginRight:10,paddingTop:4,paddingBottom:4}}  alt={"Google"}/>
                                    Sign In With Google
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

export default ProtectedRoute(Login,true);
