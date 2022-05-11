import type {NextPage} from 'next'
import {
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper,
    TextField,
    Typography
} from "@mui/material";
import Header from "../../components/header/header";
import PageTitle from "../../components/inline-components/page-title";
import Footer from "../../components/footer/footer";
import Tabs from "../../components/inline-components/tabs";
import {Settings, Visibility, VisibilityOff} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import CustomCard from "../../components/inline-components/card";
import React, {useContext, useEffect, useState} from "react";
import {$$active2FA, $$disable2FA, $$get2FA, $$getMe, $$updatePassword} from "../../utils/api";
import {toast} from "react-toastify";
import {Me} from "../../utils/interfaces";
import {themeModeContext} from "../../utils/context";


const useStyles: any = makeStyles((theme: any) => ({}));

const WatchersPage: NextPage = () => {
    const styles = useStyles();
    const [qrCode, setQRCode] = useState();
    const [token, setToken] = useState<string>('');
    const [user, setUser] = useState<Me>();
    const [open, setOpen] = useState<boolean>(false);
    const [recovery,setRecovery] = useState<Array<string>>([]);
    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [repeatPass, setRepeatPass] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const {mode} = useContext(themeModeContext);
    useEffect(() => {
        $$getMe().then(response => {
            setUser(response.data);
        })
    }, []);

    const close2FaModal = () => {
        setOpen(false);
    };

    const open2FAModal = () => {
        setOpen(true);
};

    const tabLinks = [
        {
            title: 'Account',
            link: "/profile",
            active: false
        },
        {
            title: "Security",
            link: "/profile/security",
            active: true
        }
    ];

    const request2fa = () => {
        $$get2FA().then(response => {
            setQRCode(response.data.qrCode);
            open2FAModal();
        })

    };

    const submit2FA = () => {
      $$active2FA(token).then(response => {
        setRecovery(response.data);
        toast.success('Two Factor Authentication has been activated.');
      }).catch(response => {
        toast.error('Wrong Token , Please Try Again');
      });
    };

    const disable2fa = () => {
        $$disable2FA(token).then(response => {
            setRecovery(response.data);
            toast.success('Two Factor Authentication has been deactivated.');
        }).catch(response => {
            toast.error('Wrong Token , Please Try Again');
        });
    };

    const updatePassword = () => {
        setLoading(true);
        $$updatePassword(currentPass,newPass,repeatPass).then(response => {
            toast.success('Password Updated Successfully!');
            setCurrentPass('');
            setRepeatPass('');
            setNewPass('');
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Grid container>
            <Header/>
            <Tabs data={tabLinks}/>
            <CustomCard titleProps={{title: "Two Factor Authentication (2FA)"}}>
                <Box className={"darkText"}>
                    {
                        user?.user.security.has2fa ? (
                            <>
                                <Typography>
                                    Two-Factor Authentication can be used to help protect your account from unauthorized access by requesting you to enter a security code when you sign in.
                                </Typography>
                                <Box textAlign={"right"}>
                                    <Button onClick={disable2fa} variant={"contained"}>
                                        Deactivate 2FA
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography>
                                    Two-Factor Authentication can be used to help protect your account from unauthorized access by
                                    requesting you to enter a security code when you sign in.
                                </Typography>
                                <Box textAlign={"right"}>
                                    <Button onClick={request2fa} variant={"contained"}>
                                        Active 2FA
                                    </Button>
                                </Box>
                            </>
                        )
                    }
                </Box>
            </CustomCard>
            <CustomCard titleProps={{title: "Change Password"}}>
                <FormControl variant={mode == 'dark' ? 'filled' : "outlined"} fullWidth>
                    <InputLabel htmlFor="password">Current Password</InputLabel>
                    <OutlinedInput
                        onChange={(e) => setCurrentPass(e.target.value)}
                        required
                        type={!showPassword ? 'password' : 'text'}
                        id="currentPass"
                        label="Current Password"
                        value={currentPass}
                        fullWidth
                        inputProps={{autoComplete: "false"}}
                        sx={{mb: 2,backgroundColor: mode == 'dark' ? '#fff' : undefined}}
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
                <FormControl variant={mode == 'dark' ? 'filled' : "outlined"} fullWidth>
                    <InputLabel htmlFor="password">New Password</InputLabel>
                    <OutlinedInput
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                        type={!showPassword ? 'password' : 'text'}
                        id="newPass"
                        label="New Password"
                        value={newPass}
                        fullWidth
                        inputProps={{autoComplete: "false"}}
                        sx={{mb: 2,backgroundColor: mode == 'dark' ? '#fff' : undefined}}
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
                <FormControl variant={mode == 'dark' ? 'filled' : "outlined"} fullWidth>
                    <InputLabel htmlFor="repeat_password">Repeat Password</InputLabel>
                    <OutlinedInput
                        onChange={(e) => setRepeatPass(e.target.value)}
                        required
                        type={!showPassword ? 'password' : 'text'}
                        id="repeat_password"
                        label="Repeat Password"
                        value={repeatPass}
                        fullWidth
                        inputProps={{autoComplete: "false"}}
                        sx={{mb: 2,backgroundColor: mode == 'dark' ? '#fff' : undefined}}
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
                <Box textAlign={"right"}>
                    <Button color={"primary"} variant={"contained"} onClick={updatePassword} startIcon={loading ? <CircularProgress size={20} /> : ''} disabled={loading}>
                        Update
                    </Button>
                </Box>
            </CustomCard>
            <Footer/>
            <Dialog open={open} onClose={close2FaModal} maxWidth={"md"} fullWidth>
                <DialogTitle>{
                    recovery.length > 0 ?  "Activate 2FA" : "Your Recovery Codes" }</DialogTitle>
                <DialogContent>
                    {
                        recovery.length > 0 ? (
                            <>
                                <Typography>
                                    Scan the following QR Code in the Authenticator app in your phone.
                                    <br />
                                </Typography>
                                <Box textAlign={"center"}>
                                    <img src={qrCode} />
                                </Box>
                                <Typography>
                                    After you have scanned the image above, a new code would appear in the app. Please enter it below to activate Two Factor Authentication.
                                </Typography>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Token"
                                    fullWidth
                                    variant="standard"
                                    value={token}
                                    onChange={e => setToken(e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <Grid container>
                                    {recovery.map((item,index) => (
                                        <Grid key={index} item sm={6} xs={12} sx={{my: 2}}>
                                            <Paper style={{textAlign:"center"}} variant={"outlined"} sx={{mx:2,py:2}}>
                                                {item}
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Typography align={"center"}>
                                    Write these codes somewhere safe. You can use each code once instead of the one we text you to log back into your account.
                                </Typography>
                            </>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={close2FaModal}>Close</Button>
                    <Button onClick={submit2FA} disabled={token.length < 1}>Active</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default WatchersPage;
