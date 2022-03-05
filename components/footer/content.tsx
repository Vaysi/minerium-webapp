import {
    Button,
    Container,
    Grid,
    IconButton, List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import {useRouter} from "next/router";
import {makeStyles} from "@mui/styles";
import Logo from "../inline-components/logo";

const useStyles:any = makeStyles((theme:any) => ({
   footer: {
       background: "linear-gradient(to bottom, #032561 0%, #053ea1 100%)",
       minHeight: 150,
       borderTop: "4px var(--accent) solid",
       color: "#fff",
       marginTop: 40,
       width: "100%",
       padding: "50px 0"
   },
    sectionTitle: {
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: 1.5,
        fontSize: 17,
        marginBottom: "0.15em"
    },
    fraud:{
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        color: "#fff",
        opacity: 0.8,
        fontSize: 13
    },
    navLinks: {
        padding: 0,
        margin: 0
    },
    logoSubtitle: {
       fontSize: 16,
        paddingBottom: 7,
        borderBottom: "1px var(--accent) solid",
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: 0,
    }
}));

const Content = () => {
    const router = useRouter();
    const styles = useStyles();

    return (
        <div className={styles.footer}>
           <Container maxWidth={"xl"}>
               <Grid container>
                    <Grid sx={{mb:{xs:3,md:0}}} item xs={12} md={5}>
                        <Logo mode={"white"} styles={{maxWidth:220,display: "block"}} />
                        <Typography variant={"caption"} className={styles.logoSubtitle}>The Most Profitable Multi-Currency Mining Pool</Typography>
                        <Typography  style={{marginTop: 10}}>
                            business@minerium.com
                        </Typography>
                        <Typography>
                            support@minerium.com
                        </Typography>
                    </Grid>
                    <Grid sx={{mb:{xs:3,md:0}}} item xs={12} md={2}>
                        <Typography className={styles.sectionTitle} variant={"caption"}>
                            QUICK LINKS
                        </Typography>
                        <nav aria-label="main mailbox folders">
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton className={styles.navLinks}>
                                        <ListItemText primary="About us" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton className={styles.navLinks}>
                                        <ListItemText primary="News" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton className={styles.navLinks}>
                                        <ListItemText primary="Privacy" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton className={styles.navLinks}>
                                        <ListItemText primary="Terms" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton className={styles.navLinks}>
                                        <ListItemText primary="FAQ" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton className={styles.navLinks}>
                                        <ListItemText primary="Contact" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </nav>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Typography className={styles.sectionTitle} variant={"caption"}>
                            FRAUD WARNING
                        </Typography>
                        <Typography className={styles.fraud} variant={"subtitle1"}>
                            There is a growing number of Internet sites using the &apos;Minerium&apos; name, purporting to represent Minerium and positioning themselves as official representer of Minerium. These fraudulent websites do not represent us and we reserves the right to take legal action to stop fraudulent activities conducted by them. If you receive any offers from companies whose website names were made up to resemble the domain names of the Minerium, such as www.minerium.co, www.minerium.net, please report to us at support@minerium.com
                        </Typography>
                    </Grid>
               </Grid>
           </Container>
        </div>
    );
}

export default Content;
