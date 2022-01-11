import styles from "../../styles/Header.module.css";
import {Container, Typography} from "@mui/material";
import {useRouter} from "next/router";
interface Props {
    title: string;
    icon: any;
}
const PageTitle = (props:Props) => {
    const router = useRouter();
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
