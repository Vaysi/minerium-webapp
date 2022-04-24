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
    Grid, IconButton, InputAdornment,
    TextField
} from "@mui/material";
import Header from "../../components/header/header";
import PageTitle from "../../components/inline-components/page-title";
import {Google, Login as LoginIcon, Visibility, VisibilityOff} from "@mui/icons-material";
import Footer from "../../components/footer/footer";
import {makeStyles} from "@mui/styles";
import React, {useContext, useEffect, useState} from "react";
import {$$userLogin} from "../../utils/api";
import {toast} from "react-toastify";
import {clearAuthTokens, isLoggedIn, setAuthTokens} from "axios-jwt";
import {themeModeContext, userContext} from "../../utils/context";
import ProtectedRoute from "../../components/ProtectedRoute";
import CustomCard from "../../components/inline-components/card";
import {useRouter} from "next/router";
import {readCookie, setCookie} from "../../utils/functions";

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
        fontSize: 16,
        "&:hover,&:active": {
            backgroundColor: "transparent!important"
        }
    },
    input: {
        backgroundColor: "#F5F5F7",
        boxShadow: "inset 0px 1px 10px rgba(0, 0, 0, 0.25)",
        marginTop: "20px!important"
    },
    commonBtn:{
        width: "250px"
    },
    google: {
        boxShadow: "0px 10px 10px -2px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#F5F5F7!important",
        borderRadius: "7px!important",
        border: "none!important",
        textTransform: "none"
    }
}));

const Login: NextPage = () => {
    const styles = useStyles();
    const {user,setUser} = useContext(userContext);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {mode} = useContext(themeModeContext);
    const router = useRouter();

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

    useEffect(() => {
        if(router.isReady){
            const {logout} = router.query;
            if(logout) {
                clearAuthTokens();
                setUser({...user,loggedIn:false});
                let isLogout = readCookie('logout');
                if(isLogout == 'false'){
                    toast.warning('You Logged out automatically , login again to continue');
                    setCookie('logout',"true",10000);
                }
            }
        }
    },[router.isReady]);


    return (
        <Grid container>
            <Header/>
            <Container sx={{maxWidth: {xs: "xl", md: "sm"}}}>
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
                            type={!showPassword ? 'password' : 'text'}
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
                            InputProps={{
                                endAdornment:(
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{mr:0}}
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        </form>
                        <Grid container>
                            <Grid item xs={12}>
                                <Button sx={{color: mode == 'dark' ? "#fff!important" : undefined,fontWeight:600,borderBottom:"1px solid  rgba(4, 49, 128, 0.61)",padding:0,marginTop:1,textTransform: "none",marginBottom:2,borderRadius:0}} className={styles.button} style={{paddingLeft: 5,paddingRight:5}}>
                                    Forgot Password?
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
                                    Sign in with Google
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
