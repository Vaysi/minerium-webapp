import {Card, CardContent, CardHeader, Container} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles: any = makeStyles((theme: any) => ({
    cardHeader: {
        backgroundColor: "transparent",
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)"
    },
    subtitle: {
        backgroundColor: "rgba(3, 37, 97, 0.1)",
        borderRadius: 3,
        padding: "0 3px"
    },
    card: {
        backgroundColor: "var(--blue-ghost)!important",
        boxShadow: "2px 10px 60px rgba(0, 0, 0, 0.25)",
        borderRadius: 16
    }
}));

interface Props {
    titleProps: any;
    children: any;
    align?: string;
    cardProps?: any;
}

const CustomCard = (props:Props) => {
    const styles = useStyles();
    return (
        <Container maxWidth={"xl"}>
            <Card className={styles.card} sx={{mt: 3}} {...props.cardProps}>
                <CardHeader
                    className={styles.cardHeader}
                    titleTypographyProps={{
                        style: {
                            color: "#043180",
                            fontFamily: "var(--font-header)",
                            fontWeight: 600,
                            fontSize: 30,
                            textAlign: props.align ? props.align : "inherit"
                        }
                    }}
                    {...props.titleProps}
                />
                <CardContent className={styles.cardContent}>
                    {props.children}
                </CardContent>
            </Card>
        </Container>
    );
}

export default CustomCard;
