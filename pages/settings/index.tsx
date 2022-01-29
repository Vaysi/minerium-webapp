import type {NextPage} from 'next'
import {Grid} from "@mui/material";
import Header from "../../components/header/header";
import PageTitle from "../../components/inline-components/page-title";
import Footer from "../../components/footer/footer";
import Tabs from "../../components/inline-components/tabs";
import {Settings} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import Preferences from "../../components/settings/preferences";
import PaymentSettings from "../../components/settings/payment";


const useStyles: any = makeStyles((theme: any) => ({

}));

const SettingsPage: NextPage = () => {
    const styles = useStyles();

    const tabLinks = [
        {
            title: 'Payments',
            link: "settings",
            active: true
        },
        {
            title: "Notifications",
            link: "settings/notifications",
            active: false
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
            <Preferences />
            <PaymentSettings />
            <Footer/>
        </Grid>
    );
};

export default SettingsPage;
