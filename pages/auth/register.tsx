import type {NextPage} from 'next'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField
} from "@mui/material";
import Header from "../../components/header/header";
import {Google, Visibility, VisibilityOff,} from "@mui/icons-material";
import Footer from "../../components/footer/footer";
import {makeStyles} from "@mui/styles";
import React, {useContext, useEffect, useState} from "react";
import {isLoggedIn} from "axios-jwt";
import {userContext} from "../../utils/context";
import {$$userRegister} from "../../utils/api";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

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

    const ready = () => {
        if(email.length > 4 && username.length > 4 && password == confirmPassword && agreed) {
            return true;
        }else {
            return false;
        }
    };

    const onSubmit = () => {
        setLoading(true);
        $$userRegister(email,password,confirmPassword,username).then(response => {
            let urlParams = new URLSearchParams({
                email: email,
                expireDate: response.data.expireDate
            }).toString();
            setTimeout(() => {
                router.push('/auth/verify?' + urlParams);
            },1000);
            setUser({...user,email,username});
            setLoading(false);
        }).catch(reason => {
            let close = reason.data == 'TRY_LOGIN' ? 7000 : 5000;
            if('message' in reason){
                toast.error(reason.message,{autoClose: close});

                if(reason.data == 'TRY_LOGIN'){
                    setTimeout(() => {
                        router.push('/auth/login');
                    },7500);
                }

                if(reason.data == 'NOT_VERIFIED'){
                    let urlParams = new URLSearchParams({
                        email: email,
                        expireDate: reason.data.expireDate
                    }).toString();
                    setTimeout(() => {
                        router.push('/auth/verify?' + urlParams);
                    },1000);
                }
            }
            setLoading(false);
        });

    };
    useEffect(() => {
        console.log(isLoggedIn());
    }, [user]);

    return (
        <Grid container>
            <Header/>
            <Container sx={{maxWidth: {xs: "xl", md: "md", xl: "sm"}}}>
                <Card sx={{mt: 3}}>
                    <CardHeader
                        className={styles.cardHeader}
                        title="Register"
                        titleTypographyProps={{
                            style: {
                                fontSize: 17,
                                color: "#fff"
                            }
                        }}
                    />
                    <CardContent className={styles.cardContent}>
                        <Box>
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                id="email"
                                label="Email"
                                fullWidth
                                sx={{mb: 2}}
                            />
                            <TextField
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                id="username"
                                label="Username"
                                fullWidth
                                sx={{mb: 2}}
                            />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    type={!showPassword ? 'password' : 'text'}
                                    id="password"
                                    label="Password"
                                    fullWidth
                                    sx={{mb: 2}}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="repeat_password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    type={!showPassword ? 'password' : 'text'}
                                    id="repeat_password"
                                    label="Confirm Password"
                                    fullWidth
                                    sx={{mb: 2}}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControl>
                                <FormControlLabel label={(
                                    <>
                                        I have read and accept the <a target="_blank" rel={"noreferrer"}
                                                                      href="https://minerium.com/terms-of-services/">Terms
                                        and Conditions</a>.</>
                                )} control={<Checkbox defaultChecked onClick={() => setAgreed(!agreed)}
                                                      checked={agreed}/>}/>
                            </FormControl>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Button fullWidth onClick={onSubmit} className={styles.button} variant={"contained"}
                                            startIcon={loading ? <CircularProgress size={20}/> : ''}
                                            disabled={!ready() || loading}>
                                        Register
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{mt: 2, mb: 2}}/>
                                    <Button color={"primary"} variant="outlined" fullWidth>
                                        <Google sx={{mr: 1, color: "#DE4032"}}/>
                                        Register With Google
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
            <Footer/>
        </Grid>
    );
};

export default Register;
