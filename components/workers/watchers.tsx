import {
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import CustomCard from "../../components/inline-components/card";
import {useEffect, useState} from "react";
import {Watchers as WatchersContract} from "../../utils/interfaces";
import {$$deleteWatcher, $$getWatchers} from "../../utils/api";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import {CopyToClipboard} from "react-copy-to-clipboard";


const useStyles: any = makeStyles((theme: any) => ({}));

const Watchers = () => {
    const styles = useStyles();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number>();

    const handleClickOpen = (watcherId: number) => {
        setSelected(watcherId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [watchers, setWatchers] = useState<Array<WatchersContract>>([]);

    useEffect(() => {
        $$getWatchers().then(response => {
            setWatchers(response.data);
        })
    }, []);


    const deleteWatcher = (watcherId: any) => {
        handleClose();
        $$deleteWatcher(watcherId).then(response => {
            setWatchers(watchers.filter(item => item.id != watcherId));
            toast.success('Watcher Deleted Successfully!');
        });
    };

    const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '';

    return (
        <>
            <CustomCard titleProps={{title: "Watchers"}}>
                <List sx={{width: '100%'}} dense={true}>
                    {watchers.map((item) => {
                        const labelId = `checkbox-list-label-${item.id}`;

                        return (
                            <ListItem
                                key={item.id}
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{'aria-labelledby': labelId}}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={(
                                        <>
                                            <span onClick={() => router.push(hostname + "/watchers/" + item.token)} style={{marginRight:50}}>{item.remark}</span>
                                            <CopyToClipboard text={hostname + "/watchers/" + item.token}
                                                             onCopy={() => toast.success('Successfully Copied !')}>
                                                <Tooltip title="Click To Copy">
                                                    <Chip label="Link" size={"small"} sx={{ml: 2, cursor: "pointer"}}
                                                          color={"primary"}/>
                                                </Tooltip>
                                            </CopyToClipboard>

                                            <IconButton edge="end" aria-label="comments">
                                                <Delete onClick={() => handleClickOpen(item.id)}/>
                                            </IconButton>
                                        </>
                                    )}/>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </CustomCard>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    Remove watcher
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this watcher ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => deleteWatcher(selected)}>Yes</Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Watchers;