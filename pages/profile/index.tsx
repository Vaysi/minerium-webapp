import type {NextPage} from 'next'
import {Box, Button, CircularProgress, Grid, TextField} from "@mui/material";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Tabs from "../../components/inline-components/tabs";
import {makeStyles} from "@mui/styles";
import CustomCard from "../../components/inline-components/card";
import {useEffect, useState} from "react";
import {Me} from "../../utils/interfaces";
import {$$getMe, $$setMe} from "../../utils/api";
import {toast} from "react-toastify";


const useStyles: any = makeStyles((theme: any) => ({
    input: {
        backgroundColor: "#F5F5F7",
        boxShadow: "inset 0px 1px 10px rgba(0, 0, 0, 0.25)",
        marginTop: "20px!important"
    },
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
            link: "/profile",
            active: true
        },
        {
            title: "Security",
            link: "/profile/security",
            active: false
        }
    ];

    const save = () => {
        setLoading(true);
        $$setMe(firstName, lastName).then(response => {
            toast.success('Information Saved!');
            setLoading(false);
        });
    };

    return (
        <Grid container>
            <Header/>
            <Tabs data={tabLinks}/>
            <CustomCard titleProps={{title: "Information"}}>
               <Box className={"noBorder"}>
                   <TextField sx={{mb: 2}} fullWidth label="Username" variant="standard" focused
                              classes={{root: styles.input}} disabled value={user?.user?.username || ''}/>
                   <TextField sx={{mb: 2}} fullWidth label="Email Address" variant="standard" focused
                              classes={{root: styles.input}} disabled value={user?.user?.email || ''}/>
                   <TextField sx={{mb: 2}} fullWidth label="First Name" variant="standard" focused
                              classes={{root: styles.input}} value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}/>
                   <TextField sx={{mb: 2}} fullWidth label="Last Name" variant="standard" focused
                              classes={{root: styles.input}} value={lastName}
                              onChange={(e) => setLastName(e.target.value)}/>
                   <Box textAlign={"right"}>
                       <Button onClick={save} variant={"contained"}
                               startIcon={loading ? <CircularProgress size={20}/> : ''} disabled={loading}>
                           Save
                       </Button>
                   </Box>
               </Box>
            </CustomCard>
            <Footer/>
        </Grid>
    );
};

export default WatchersPage;
