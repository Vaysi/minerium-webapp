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
import {useContext, useEffect, useState} from "react";
import {$$userLogin} from "../../utils/api";
import {toast} from "react-toastify";
import {isLoggedIn, setAuthTokens} from "axios-jwt";
import {userContext} from "../../utils/context";
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

const Login: NextPage = () => {
    const styles = useStyles();
    const {user,setUser} = useContext(userContext);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
        console.log(isLoggedIn());
    },[user]);

    return (
        <Grid container>
            <Header/>
            <PageTitle title={"LOGIN"} icon={<LoginIcon style={{width: 35, height: "auto"}}/>}/>
            <Container sx={{maxWidth: {xs: "xl", md: "md", xl: "sm"}}}>
                <Card sx={{mt: 3}}>
                    <CardHeader
                        className={styles.cardHeader}
                        title="Login"
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
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                id="identifier"
                                label="Email/Username"
                                fullWidth
                                sx={{mb: 2}}
                            />
                            <TextField
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                type={"password"}
                                id="password"
                                label="Password"
                                fullWidth
                                sx={{mb: 2}}
                            />
                            <Grid container>
                                <Grid item xs={6}>
                                    <Button className={styles.button} style={{paddingLeft: 5}}>
                                        Forgot Password ?
                                    </Button>
                                </Grid>
                                <Grid justifyContent={"end"} style={{textAlign: "right"}} item xs={6}>
                                    <Button onClick={onSubmit} className={styles.button} variant={"contained"} startIcon={loading ? <CircularProgress size={20} /> : ''} disabled={loading}>
                                        Login
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{mt: 2, mb: 2}}/>
                                    <Button color={"primary"} variant="outlined" fullWidth>
                                        <Google sx={{mr: 1, color: "#DE4032"}}/>
                                        Login With Google
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

export default ProtectedRoute(Login,true);
