import Link from 'next/link';
import styles from "../../styles/Header.module.css";
import {Button, Container, Grid, IconButton} from "@mui/material";
import {DarkModeOutlined, AccountCircleOutlined, LightModeOutlined, Logout} from "@mui/icons-material";
import {useContext} from "react";
import {themeModeContext} from "../../utils/context";
import {useRouter} from "next/router";

const TopHeader = () => {
    const {mode, setMode} = useContext(themeModeContext);
    const router = useRouter();
    return (
        <div className={styles.topHeader}>
           <Container maxWidth={"xl"}>
               <Grid container>
                   <Grid item xs={6}>
                       <IconButton className={`${styles.themeMode} ${mode == 'light' ? styles.active : ''}`} aria-label="light mode" component="span" onClick={() => setMode('light')}>
                           <LightModeOutlined />
                       </IconButton>
                       <IconButton className={`${styles.themeMode} ${mode == 'dark' ? styles.active : ''}`} aria-label="dark mode" component="span" onClick={() => setMode('dark')}>
                           <DarkModeOutlined />
                       </IconButton>
                   </Grid>
                   <Grid item xs={6} textAlign={"right"}>
                       <Button onClick={() => router.push('/profile')} className={styles.topHeaderLinks} startIcon={<AccountCircleOutlined />} sx={{mr:2}}>
                            vaysi.erfan
                       </Button>
                       <Button onClick={() => router.push('/auth/logout')} className={styles.topHeaderLinks} startIcon={<Logout />}>
                           Logout
                       </Button>
                   </Grid>
               </Grid>
           </Container>
        </div>
    );
}

export default TopHeader;
