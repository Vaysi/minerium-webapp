import type {NextPage} from 'next'
import {Grid} from "@mui/material";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Tabs from "../../components/inline-components/tabs";
import {makeStyles} from "@mui/styles";
import Preferences from "../../components/settings/preferences";
import PaymentSettings from "../../components/settings/payment";

const PreferencesComp = Preferences as any;
const PaymentSettingsComp = PaymentSettings as any;

const useStyles: any = makeStyles((theme: any) => ({}));

const SettingsPage: NextPage = () => {
    const styles = useStyles();

    const tabLinks = [
        {
            title: 'Payments',
            link: "/settings",
            active: true
        },
        {
            title: "Notifications",
            link: "/settings/notifications",
            active: false
        }
    ];
    return (
        <Grid container>
            <Header/>
            <Tabs data={tabLinks}/>
            <PreferencesComp/>
            <PaymentSettingsComp/>
            <Footer/>
        </Grid>
    );
};

export default SettingsPage;
