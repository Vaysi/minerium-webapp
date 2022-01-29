import type {NextPage} from 'next'
import {Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, TextField} from "@mui/material";
import Header from "../../components/header/header";
import PageTitle from "../../components/inline-components/page-title";
import Footer from "../../components/footer/footer";
import Tabs from "../../components/inline-components/tabs";
import {Settings} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import CustomCard from "../../components/inline-components/card";
import {useEffect, useState} from "react";
import {Notifications} from "../../utils/interfaces";
import {$$getNotifications, $$setNotifications} from "../../utils/api";
import {toast} from "react-toastify";


const useStyles: any = makeStyles((theme: any) => ({
    input: {
        width: 70
    }
}));

const SettingsPage: NextPage = () => {
    const styles = useStyles();

    const [notifications, setNotifications] = useState<Notifications>({
        hashrate: 0,
        totalHashrate: 0,
        dailyReport: false,
        activeWorkers: 0
    });

    const [showHashrate, setShowHashrate] = useState(false);
    const [showActiveWorkers, setShowActiveWorkers] = useState(false);
    const [showTotalHashrate, setShowTotalHashrate] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const changeField = (field: string, value: string|boolean|number) => {
        let newNotification = {...notifications};
        // @ts-ignore
        newNotification[field] = value;
        setNotifications({...newNotification});
    };

    useEffect(() => {
        $$getNotifications().then(response => {
            setNotifications(response.data);
            setShowHashrate(response.data.hashrate > -1);
            setShowTotalHashrate(response.data.totalHashrate > -1);
            setShowActiveWorkers(response.data.activeWorkers > -1);
        })
    }, []);

    const submit = () => {
        setLoading(true);
        $$setNotifications(notifications.activeWorkers, notifications.dailyReport, notifications.hashrate, notifications.totalHashrate).then(response => {
            setLoading(false);
            toast.success('Settings Saved !');
        });
    };

    const tabLinks = [
        {
            title: 'Payments',
            link: "settings",
            active: false
        },
        {
            title: "Notifications",
            link: "settings/notifications",
            active: true
        },
        {
            title: "Watchers",
            link: "settings/watchers",
            active: false
        }
    ];
    return (
        <Grid container>
            <Header/>
            <PageTitle title={"SETTING"} icon={<Settings style={{width: 35, height: "auto"}}/>}/>
            <Tabs data={tabLinks}/>
            <CustomCard titleProps={{title: "Notifications"}}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox onChange={(e) => changeField('dailyReport',!notifications.dailyReport)} checked={notifications.dailyReport as boolean}/>}
                                      label="Receive daily report"/>
                </FormGroup>
                <FormGroup row={true} style={{justifyContent: "space-between"}}>
                    <FormControlLabel
                        control={<Checkbox checked={showHashrate} onChange={(e) => setShowHashrate(!showHashrate)}/>}
                        label="Report if hash rate of any worker falls under a specific value (TH)"/>
                    <TextField
                        margin="dense"
                        id="hashrate"
                        value={notifications.hashrate}
                        variant="outlined"
                        size={"small"}
                        onChange={(e) => changeField('hashrate', e.target.value)}
                        className={styles.input}
                        disabled={!showHashrate}
                    />
                </FormGroup>
                <FormGroup row={true} style={{justifyContent: "space-between"}}>
                    <FormControlLabel control={<Checkbox checked={showActiveWorkers}
                                                         onChange={(e) => setShowActiveWorkers(!showActiveWorkers)}/>}
                                      label="Report if number of active workers falls under a specific value"/>
                    <TextField
                        margin="dense"
                        id="activeWorkers"
                        value={notifications.activeWorkers}
                        variant="outlined"
                        size={"small"}
                        onChange={(e) => changeField('activeWorkers', e.target.value)}
                        disabled={!showActiveWorkers}
                        className={styles.input}
                    />
                </FormGroup>
                <FormGroup row={true} style={{justifyContent: "space-between"}}>
                    <FormControlLabel control={<Checkbox checked={showTotalHashrate}
                                                         onChange={(e) => setShowTotalHashrate(!showTotalHashrate)}/>}
                                      label="Report if total hash rate falls under a specific value (TH)"/>
                    <TextField
                        margin="dense"
                        id="totalHashrate"
                        value={notifications.totalHashrate}
                        variant="outlined"
                        size={"small"}
                        onChange={(e) => changeField('totalHashrate', e.target.value)}
                        disabled={!showTotalHashrate}
                        className={styles.input}
                    />
                </FormGroup>
                <Box sx={{mt:2}} textAlign={"right"}>
                    <Button onClick={submit} variant={"contained"}
                            startIcon={loading ? <CircularProgress size={20}/> : ''} disabled={loading}>
                        Submit
                    </Button>
                </Box>
            </CustomCard>
            <Footer/>
        </Grid>
    );
};

export default SettingsPage;
