import {
    Container,
    Grid,
    Link,
    Typography
} from "@mui/material";
import {useRouter} from "next/router";
import {makeStyles} from "@mui/styles";
import {Facebook, Instagram, LinkedIn, Twitter} from "@mui/icons-material";

const useStyles:any = makeStyles((theme:any) => ({
    copyRight: {
        background: "#fff",
        minHeight: 80,
        width: "100%",
    },
    text: {
        fontSize: 14,
        padding: 0,
    },
    followUs:{
        display:"inline-block",
        color: "#043180",
        fontWeight: "bold",
        margin: "0 10px 0 0"
    },
    socialIcon: {
        color: "#A5A5A5",
        width:30,
        height: 30,
        position: "relative",
        top: 8,
        transition: "all ease-in 200ms",
        "&:hover": {
            color: "var(--accent)"
        }
    }
}));

const CopyRight = () => {
    const router = useRouter();
    const styles = useStyles();

    return (
        <div className={styles.copyRight}>
            <Container maxWidth={"xl"} style={{height:"100%"}}>
                <Grid container alignItems={"center"} style={{height:"100%"}}>
                    <Grid item xs={6}>
                        <Typography className={styles.text}>
                            © 2022 Minerium, All Rights Reserved
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign={"right"}>
                        <Typography className={styles.followUs}>
                            FIND US ON
                        </Typography>
                        <Link href="#">
                            <LinkedIn className={styles.socialIcon}/>
                        </Link>
                        <Link href="#">
                            <Twitter  className={styles.socialIcon} />
                        </Link>
                        <Link href="#">
                            <Facebook className={styles.socialIcon}/>
                        </Link>
                        <Link href="#">
                            <Instagram className={styles.socialIcon} />
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default CopyRight;
