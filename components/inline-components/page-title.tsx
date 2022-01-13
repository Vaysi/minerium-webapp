import {Container, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles:any = makeStyles((theme:any) => ({
    pageTitle: {
        backgroundColor: "#043180",
        width: "100%",
        padding: "7px 0"
    },
    title: {
        color: "#fff",
        fontSize: 24,
    }
}));

interface Props {
    title: string;
    icon: any;
}
const PageTitle = (props:Props) => {
    const styles = useStyles();
    return (
        <div className={styles.pageTitle}>
           <Container maxWidth={"xl"}>
              <Typography className={styles.title} sx={{display:"flex",alignItems:"center"}}>
                  <span style={{marginTop: 5,marginRight: 15}}>
                      {props.icon}
                  </span>
                  <span>
                      {props.title}
                  </span>
              </Typography>
           </Container>
        </div>
    );
}

export default PageTitle;
