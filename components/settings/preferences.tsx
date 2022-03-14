import type {NextPage} from 'next'
import {
    Alert, Box, Button,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider, Grid,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import CustomCard from "../../components/inline-components/card";
import {useContext, useEffect, useState} from "react";
import {$$changePaymentPreference, $$getAllPPS} from "../../utils/api";
import Image from 'next/image';
import {makeStyles} from "@mui/styles";
import {AllPPS, Coins} from "../../utils/interfaces";
import {themeModeContext} from "../../utils/context";


const useStyles: any = makeStyles((theme: any) => ({
    menuItem: {
        minWidth: 35
    },
    alert: {
        backgroundColor:"#CEDBEF",
        color: "#043180",
    }
}));

const Preferences: NextPage = () => {
    const styles = useStyles();
    const [ppsCoins, setPpsCoins] = useState<AllPPS>();
    const [selected, setSelected] = useState<string>('btc');
    const [loading, setLoading] = useState<boolean>(false);
    const [done, setDone] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const {mode} = useContext(themeModeContext);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitPreference = () => {
        handleClose();
        setLoading(true);
        $$changePaymentPreference(selected).then(response => {
            setDone(true);
            setLoading(false);
        })
    };

    useEffect(() => {
        $$getAllPPS().then(response => {
            let data = response.data;
            data.pps = data.pps.map((item: Coins) => {
                item.icon = `/coins/${item.coin}.svg`;
                return item;
            });
            setSelected(data.preference);
            setPpsCoins(data);
        });
    }, []);
    return (
        <>
            <CustomCard titleProps={{title: "Preferred Payment Currency"}}>

                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Alert icon={false} severity="info" className={styles.alert}>
                            <Typography fontWeight={"bold"} variant={"h5"}>
                                Please Note
                            </Typography>
                            <Divider/>
                            <p><b>Changing Preferred Payment Currency</b>, changes how we
                                calculate your earnings from the next hour until you change it
                                again. You &nbsp;
                                <b>Can Not Undo</b> &nbsp;
                                the change but you can change the currency in the future.</p>
                        </Alert>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{pl: {xs:0,md:2}}}>
                        <Typography sx={{my: 2,color: mode == 'dark' ? "#fff" : undefined}}>
                            Preferred Payment Currency
                        </Typography>
                        <Select sx={{backgroundColor: mode == 'dark' ? "#fff" : undefined}} value={selected} onChange={(e) => {
                            setSelected(e.target.value);
                            setDone(false);
                        }} variant={"outlined"}>
                            {ppsCoins != null && ppsCoins.pps.map((item: any,index) => (
                                <MenuItem value={item.coin} key={index}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                        <ListItemIcon classes={{root: styles.menuItem}}>
                                            <Image src={item.icon} width={25} height={25}/>
                                        </ListItemIcon>
                                        <ListItemText primary={item.coin.toUpperCase()}/>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <Box textAlign={"right"}>
                            <Button onClick={handleClickOpen} variant={"contained"} startIcon={loading ? <CircularProgress size={20} /> : ''} disabled={loading || selected == ppsCoins?.preference || done}>
                                {done ? 'Saved' : 'Submit'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CustomCard>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    Change Payment Preference
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to change your preferred currency from <b>{ppsCoins?.preference.toUpperCase()}</b> to <b>{selected.toUpperCase()}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submitPreference}>Yes</Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Preferences;
