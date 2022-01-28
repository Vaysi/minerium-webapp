import {Card, CardContent, CardHeader, Container} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles: any = makeStyles((theme: any) => ({
    cardHeader: {
        backgroundColor: "#043180",
        color: "#fff"
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)"
    },
    subtitle: {
        backgroundColor: "rgba(3, 37, 97, 0.1)",
        borderRadius: 3,
        padding: "0 3px"
    }
}));

interface Props {
    titleProps: any;
    content: any;
}

const CustomCard = (props:Props) => {
    const styles = useStyles();
    return (
        <Container maxWidth={"xl"}>
            <Card className={styles.card} sx={{mt: 3}}>
                <CardHeader
                    className={styles.cardHeader}
                    titleTypographyProps={{
                        style: {
                            fontSize: 17,
                            color: "#fff"
                        }
                    }}
                    {...props.titleProps}
                />
                <CardContent className={styles.cardContent}>
                    {props.content}
                </CardContent>
            </Card>
        </Container>
    );
}

export default CustomCard;
