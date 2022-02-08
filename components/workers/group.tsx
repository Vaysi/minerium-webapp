import {Alert, Container, FormControl, MenuItem, Select, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Groups} from "@mui/icons-material";
import {useEffect} from "react";
import {WorkerGroups} from "../../utils/interfaces";

const useStyles: any = makeStyles((theme: any) => ({
    alert: {
        backgroundColor: "var(--header-bg)",
    },
    select: {
        padding: "5px 20px"
    }
}));


interface Props {
    call: any;
    states: {
        groups: any;
        setGroups: any;
        selected: any;
        setSelected: any;
    }
}

const WorkersGroup = (props: Props) => {
    const styles = useStyles();



    return (
        <Container maxWidth={"xl"}>
            <Alert variant="filled" icon={<Groups fontSize="inherit"/>} className={styles.alert} sx={{mt: 2}}>
                <Typography>Groups</Typography>

            </Alert>
        </Container>
    );
}

export default WorkersGroup;
