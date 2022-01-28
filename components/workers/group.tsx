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

    useEffect(() => {
        if (props.states.selected == 'all') {
            props.call();
        } else {
            props.call(props.states.selected);
        }
    }, [props.states.selected]);

    return (
        <Container maxWidth={"xl"}>
            <Alert variant="filled" icon={<Groups fontSize="inherit"/>} className={styles.alert} sx={{mt: 2}}>
                <Typography>Groups</Typography>
                <FormControl style={{backgroundColor: "#fff", padding: "0 15px!important"}}>
                    <Select
                        id="groupSelect"
                        value={props.states.selected}
                        variant={"standard"}
                        onChange={(e) => props.states.setSelected(e.target.value)}
                        classes={{select: styles.select}}
                    >
                        <MenuItem value={'all'}>All</MenuItem>
                        {props.states.groups.map((item: WorkerGroups) => (
                            <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>))}
                    </Select>
                </FormControl>
            </Alert>
        </Container>
    );
}

export default WorkersGroup;
