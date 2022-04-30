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
    Grid, IconButton, InputAdornment,
    TextField, Typography
} from "@mui/material";
import Header from "../../components/header/header";
import {Check, Close, Google, Visibility, VisibilityOff,} from "@mui/icons-material";
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
import {hasLower, hasUpper} from "../../utils/functions";

const useStyles: any = makeStyles((theme: any) => ({
    button: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    commonBtn:{
        minWidth: "260px!important",
        fontFamily: "var(--font-body)!important",
        fontWeight: "600!important",
        fontSize: "16px!important",
    },
    google: {
        boxShadow: "0px 10px 10px -2px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#F5F5F7!important",
        borderRadius: "5px!important",
        border: "none!important",
    },
    rules: {
        width: "90%",
        margin: "auto!important",
        color: "#043386",
        fontFamily: "var(--font-body)!important",
        fontWeight: "600!important",
    }
}));

const Register: NextPage = () => {
    const styles = useStyles();
    const router = useRouter();
    const {user, setUser} = useContext(userContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {mode} = useContext(themeModeContext);
    const [passRules,setPassRules] = useState({
        min:false,
        lowerCase: false,
        upperCase: false,
        numbers: false
    });

    useEffect(() => {
        let newRules = {...passRules};
        if(/\d/.test(password)){
            newRules.numbers = true;
        }
        if(hasUpper(password)){
            newRules.upperCase = true;
        }
        if(hasLower(password)){
            newRules.lowerCase = true;
        }
        if(password.length > 7){
            newRules.min = true;
        }
        setPassRules(newRules);
    },[password]);
    const ready = () => {
        if (email.length > 4 && username.length > 4 && password == confirmPassword && passRules.upperCase && passRules.min && passRules.numbers && passRules.lowerCase) {
            return true;
        } else {
            return false;
        }
    };

    const onSubmit = () => {
        if(!ready()){
            toast.error('Please Enter Valid Values');
            return;
        }
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
    const validOrNot = (state:boolean) => {
        return state ? <Check color={"success"} /> : <Close color={"error"} />;
    };
    return (
        <Grid container>
            <Header/>
            <Container sx={{maxWidth: {xs: "xl", md: "sm"}}}>
                <CustomCard titleProps={{title: "Register"}}>
                    <Box className={"new-noBorder"}>
                        <TextField
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            id="email"
                            label="Email"
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            className={"authInput"}
                        />
                        <TextField
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            id="username"
                            label="Username"
                            helperText={username.length > 0 && username.length < 5 ? (
                                <>
                                    <Typography color={"red"}>
                                        Username Must be more than 4 Characters
                                    </Typography>
                                </>
                            ) : ''}
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            className={"authInput"}
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
                            helperText={password.length > 1 && (passRules.min || passRules.numbers || passRules.lowerCase || passRules.upperCase) ? (
                                <>
                                    <Typography alignItems={"center"} display={"flex"}>{validOrNot(passRules.min)} More than 8 characters</Typography>
                                    <Typography  alignItems={"center"} display={"flex"}>{validOrNot(passRules.lowerCase)} Has Lowercase characters (a-z)</Typography>
                                    <Typography  alignItems={"center"} display={"flex"}>{validOrNot(passRules.upperCase)} Has Uppercase characters (A-Z)</Typography>
                                    <Typography  alignItems={"center"} display={"flex"}>{validOrNot(passRules.numbers)} Has numbers (0-9)</Typography>
                                </>
                            ) : ''}
                            required
                            id="password"
                            label="Password"
                            type={!showPassword ? 'password' : 'text'}
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            focused
                            autoComplete={"off"}
                            className={"authInput"}
                            defaultValue={""}
                            inputProps={{
                                autocomplete: 'new-password',
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
                        <TextField
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            id="repeat_password"
                            label="Confirm Password"
                            helperText={confirmPassword.length > 1 && confirmPassword != password ? (
                                <>
                                    <Typography color={"red"}>
                                        Passwords do not match.
                                    </Typography>
                                </>
                            ) : ''}
                            fullWidth
                            sx={{mb: 2}}
                            variant={"standard"}
                            type={!showPassword ? 'password' : 'text'}
                            focused
                            className={"authInput"}
                            defaultValue={""}
                            inputProps={{
                                autocomplete: 'new-repeat-password',
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
                        <FormControl>
                            <Typography align={"center"} className={styles.rules}>
                                By signing up, I accept the Minerium <a href={"https://minerium.com/terms-of-services/"} rel={"noreferrer"} style={{color: "#2D9DEE"}}>Terms And Conditions.</a>
                            </Typography>
                        </FormControl>
                        <Grid container textAlign={"center"}>
                            <Grid item xs={12} sx={{my:2}}>
                                <Button style={{textTransform:"none"}} onClick={onSubmit} className={`${styles.button} ${styles.commonBtn}`} variant={"contained"}
                                        startIcon={loading ? <CircularProgress size={20}/> : ''}
                                        disabled={loading}>
                                    Sign Up
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button style={{textTransform:"none"}} className={`${styles.commonBtn} ${styles.google}`} color={"primary"} variant="outlined">
                                    <img src={"/assets/images/google.svg"} style={{width:25,height:25,marginRight:10,paddingTop:4,paddingBottom:4}}  alt={"Google"}/>
                                    Continue With Google
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align={"center"} sx={{mt:2}}>
                                    <a onClick={() => router.push('/auth/login')} style={{cursor:"pointer",color:"#043386",fontFamily:"var(--font-body)",fontSize:16,fontWeight:600}}>
                                        Already have an account? <span style={{textDecoration:"underline"}}>Login</span>
                                    </a>
                                </Typography>
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
