import type {NextPage} from 'next'
import {
    Box,
    Button,
    Checkbox,
    Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, TextField
} from "@mui/material";
import Header from "../../components/header/header";
import PageTitle from "../../components/inline-components/page-title";
import Footer from "../../components/footer/footer";
import Tabs from "../../components/inline-components/tabs";
import {Comment, Delete, Settings} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import CustomCard from "../../components/inline-components/card";
import {useEffect, useState} from "react";
import {Me, Notifications, Watchers} from "../../utils/interfaces";
import {$$deleteWatcher, $$getMe, $$getWatchers, $$setMe} from "../../utils/api";
import {useRouter} from "next/router";
import {toast} from "react-toastify";


const useStyles: any = makeStyles((theme: any) => ({
}));

const WatchersPage: NextPage = () => {
    const styles = useStyles();
    const [user, setUser] = useState<Me>();
    const [loading, setLoading] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');


    useEffect(() => {
        $$getMe().then(response => {
            setUser(response.data);
            setFirstName(response.data.user.firstName);
            setLastName(response.data.user.lastName);
        })
    }, []);

    const tabLinks = [
        {
            title: 'Account',
            link: "profile",
            active: true
        },
        {
            title: "Security",
            link: "profile/security",
            active: false
        }
    ];

    const save = () => {
        setLoading(true);
        $$setMe(firstName,lastName).then(response => {
           toast.success('Information Saved!');
           setLoading(false);
        });
    };

    return (
        <Grid container>
            <Header/>
            <PageTitle title={"SETTING"} icon={<Settings style={{width: 35, height: "auto"}}/>}/>
            <Tabs data={tabLinks}/>
            <CustomCard titleProps={{title: "Information"}}>
                <TextField sx={{mb:2}} fullWidth label="Username" variant="outlined" disabled value={user?.user?.username || ''}/>
                <TextField sx={{mb:2}} fullWidth label="Email Address" variant="outlined" disabled  value={user?.user?.email || ''}/>
                <TextField sx={{mb:2}} fullWidth label="First Name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                <TextField sx={{mb:2}} fullWidth label="Last Name" variant="outlined" value={lastName}  onChange={(e) => setLastName(e.target.value)}/>
                <Box textAlign={"right"}>
                    <Button onClick={save} variant={"contained"} startIcon={loading ? <CircularProgress size={20} /> : ''} disabled={loading}>
                        Save
                    </Button>
                </Box>
            </CustomCard>
            <Footer/>
        </Grid>
    );
};

export default WatchersPage;
