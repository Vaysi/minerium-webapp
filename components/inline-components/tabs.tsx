import {Container, Link, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Tab} from "../../utils/interfaces";
import {useRouter} from "next/router";

const useStyles:any = makeStyles((theme:any) => ({
    tabs: {
        backgroundColor: "#032561",
        width: "100%",
        padding: "4px 0 2px",
        boxShadow: "inset 1px 0 5px -5px rgb(0 0 0 / 50%)",
        paddingTop: 14
    },
    title: {
        color: "#fff",
        fontSize: 24,
    },
    link:{
        color:"#fff",
        padding: "5px 15px 5px",
        fontWeight: 600,
        textDecoration: "none",
        fontFamily: "var(--font-body)",
        margin: 4,
        opacity: 0.7,
        transition: "all ease-in 200ms",
        cursor: "pointer",
        "&:hover" : {
            opacity: 1
        }
    },
    active: {
        color: "#053ea1",
        backgroundColor: "#fff",
        borderRadius: "3px 3px 0 0",
        opacity: 1
    }
}));

interface Props {
    data: Array<Tab>;
}
const Tabs = (props:Props) => {
    const styles = useStyles();
    const router = useRouter();
    return (
        <div className={styles.tabs}>
           <Container maxWidth={"xl"}>
               {props.data.map(item => {
                   return (<Link key={item.title} href={item.onClick ? item.link : undefined} onClick={item.onClick ? item.onClick : () => router.push(item.link as string,undefined,{shallow:true})} className={`${styles.link} ${item.active ? styles.active : ''}`}>
                       {item.title.toUpperCase()}
                   </Link>);
               })}
           </Container>
        </div>
    );
}

export default Tabs;
