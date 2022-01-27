import {
    Alert,
    Container, FormControl, MenuItem, Select, Typography
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Groups} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {WorkerGroups} from "../../utils/interfaces";
const useStyles: any = makeStyles((theme: any) => ({
    alert: {
        backgroundColor: "var(--header-bg)",
    },
    select: {
        padding: "5px 20px"
    }
}));


interface Props{
    call: any;
    states: {
        groups: any;
        setGroups: any;
    }
}
const WorkersGroup = (props: Props) => {
    const styles = useStyles();
    const [selected,setSelected] = useState('all');


    useEffect(() => {
        if(selected == 'all'){
            props.call();
        }else {
            props.call(selected);
        }
    },[selected]);

    return (
        <Container maxWidth={"xl"}>
            <Alert variant="filled" icon={<Groups fontSize="inherit" />} className={styles.alert} sx={{mt:2}}>
                <Typography>Groups</Typography>
                <FormControl style={{backgroundColor: "#fff",padding:"0 15px!important"}}>
                    <Select
                        id="groupSelect"
                        value={selected}
                        variant={"standard"}
                        onChange={(e) => setSelected(e.target.value)}
                        classes={{ select: styles.select }}
                    >
                        <MenuItem value={'all'}>All</MenuItem>
                        {props.states.groups.map((item:WorkerGroups) => (<MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>))}
                    </Select>
                </FormControl>
            </Alert>
        </Container>
);
}

export default WorkersGroup;
