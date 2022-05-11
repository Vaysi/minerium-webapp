import type {NextPage} from 'next'
import {
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Tabs from "../../components/inline-components/tabs";
import {Delete} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import CustomCard from "../../components/inline-components/card";
import {useEffect, useState} from "react";
import {Notifications, Watchers} from "../../utils/interfaces";
import {$$deleteWatcher, $$getWatchers} from "../../utils/api";
import {useRouter} from "next/router";
import {toast} from "react-toastify";


const useStyles: any = makeStyles((theme: any) => ({}));

const WatchersPage: NextPage = () => {
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
    const [watchers, setWatchers] = useState<Array<Watchers>>([]);

    useEffect(() => {
        $$getWatchers().then(response => {
            setWatchers(response.data);
        })
    }, []);

    const tabLinks = [
        {
            title: 'Payments',
            link: "/settings",
            active: false
        },
        {
            title: "Notifications",
            link: "/settings/notifications",
            active: false
        },
        {
            title: "Watchers",
            link: "/settings/watchers",
            active: true
        }
    ];

    const deleteWatcher = (watcherId: any) => {
        handleClose();
        $$deleteWatcher(watcherId).then(response => {
            setWatchers(watchers.filter(item => item.id != watcherId));
            toast.success('Watcher Deleted Successfully!');
        });
    };
    return (
        <Grid container>
            <Header/>
            <Tabs data={tabLinks}/>
            <CustomCard titleProps={{title: "Watchers"}}>
                <List sx={{width: '100%'}} dense={true}>
                    {watchers.map((item) => {
                        const labelId = `checkbox-list-label-${item.id}`;

                        return (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="comments">
                                        <Delete onClick={() => handleClickOpen(item.id)}/>
                                    </IconButton>
                                }
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
                                            {item.remark}
                                            <Chip label="Link" size={"small"} sx={{ml: 2}}
                                                  onClick={() => router.push("watchers/" + item.token)}
                                                  color={"primary"}/>
                                        </>
                                    )}/>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </CustomCard>
            <Footer/>
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
        </Grid>
    );
};

export default WatchersPage;
