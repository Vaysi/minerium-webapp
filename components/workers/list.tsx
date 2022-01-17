import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid,
    TableCell, tableCellClasses, TableRow, TextField,
} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useEffect, useState} from "react";

const useStyles: any = makeStyles((theme: any) => ({
    earnings: {},
    card: {},
    cardHeader: {
        backgroundColor: "#043180",
        color: "#fff"
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)"
    },
    headerTitle: {
        backgroundColor: "#043180",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "3px 3px 0 0"
    },
    inactive: {
        opacity: 0.7,
        transition: "all ease-in 200ms",
        "&:hover": {
            opacity: 1
        }
    }
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#043180",
        color: "#fff",
        textAlign: "center"
    },
    [`&.${tableCellClasses.body}`]: {
        color: "#043180",
        textAlign: "center"
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "rgba(5, 62, 161, 0.01)",
    },
}));


const rows = [
    {
        id: 12,
        workerName: "hans.home3",
        oneMinute: "61.54",
        fiveMinute: "2",
        oneHour: "61.54",
        oneDay: "61.54",
        sevenDay: "61.54",
        lastUpdate: "2022-01-28 15:42",
    },
    {
        id: 13,
        workerName: "hans.home2",
        oneMinute: "14.54",
        fiveMinute: "2",
        oneHour: "18.54",
        oneDay: "19.54",
        sevenDay: "20.54",
        lastUpdate: "2022-01-07 15:42"
    },
    {
        id: 8,
        workerName: "hans.home1",
        oneMinute: "22.54",
        fiveMinute: "0",
        oneHour: "41.54",
        oneDay: "78.54",
        sevenDay: "52.54",
        lastUpdate: "2022-01-20 15:42"
    },
    {
        id: 4,
        workerName: "hans.home3",
        oneMinute: "61.54",
        fiveMinute: "2",
        oneHour: "61.54",
        oneDay: "61.54",
        sevenDay: "61.54",
        lastUpdate: "2022-01-15 15:42"
    },
    {
        id: 7,
        workerName: "hans.home3",
        oneMinute: "61.54",
        fiveMinute: "0",
        oneHour: "61.54",
        oneDay: "61.54",
        sevenDay: "61.54",
        lastUpdate: "2022-01-28 15:42"
    },
    {
        id: 9,
        workerName: "hans.home2",
        oneMinute: "14.54",
        fiveMinute: "2",
        oneHour: "18.54",
        oneDay: "0",
        sevenDay: "20.54",
        lastUpdate: "2022-01-07 15:42"
    },
    {
        id: 2,
        workerName: "hans.home1",
        oneMinute: "22.54",
        fiveMinute: "2",
        oneHour: "41.54",
        oneDay: "78.54",
        sevenDay: "52.54",
        lastUpdate: "2022-01-20 15:42"
    },
    {
        id: 1,
        workerName: "hans.home3",
        oneMinute: "61.54",
        fiveMinute: "2",
        oneHour: "61.54",
        oneDay: "0",
        sevenDay: "61.54",
        lastUpdate: "2022-01-15 15:42"
    }
];

const WorkersList = () => {
    const styles = useStyles();

    const [workers, setWorkers] = useState<Array<any>>(rows);
    const [groupModal, setGroupModal] = useState(false);
    const [watcherModal, setWatcherModal] = useState(false);

    const openGroupModal = () => {
        setGroupModal(true);
    };

    const closeGroupModal = () => {
        setGroupModal(false);
    };

    const openWatcherModal = () => {
        setWatcherModal(true);
    };

    const closeWatcherModal = () => {
        setWatcherModal(false);
    };
    const [status, setStatus] = useState({
        activeTab: 'all',
        all: 0,
        online: 0,
        offline: 0,
        inactive: 0
    });

    const applyFilter = (state: string) => {
        let newState = 'all';
        switch (state) {
            case 'online':
                setWorkers(rows.filter(worker => parseInt(worker.oneMinute) > 0));
                newState = 'online';
                break;
            case 'offline':
                setWorkers(rows.filter(worker => parseInt(worker.fiveMinute) === 0));
                newState = 'offline';
                break;
            case 'inactive':
                setWorkers(rows.filter(worker => parseInt(worker.oneDay) === 0));
                newState = 'inactive';
                break;
            default:
                setWorkers(rows);
                newState = 'all';
                break;
        }
        setStatus({...status,activeTab: newState});
    };

    const workersStatus = () => {
        let status = {
            all: rows.length,
            online: 0,
            offline: 0,
            inactive: 0,
        };
        rows.map(worker => {
                status.online += parseInt(worker.oneMinute) > 0 ? 1 : 0;
                status.offline += parseInt(worker.fiveMinute) === 0 ? 1 : 0;
                status.inactive += parseInt(worker.oneDay) === 0 ? 1 : 0;
        })
        return status;
    };

    useEffect(() => {
        setStatus({...status, ...workersStatus()});
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'oneMinute',
            headerName: '1 Minute',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'workerName',
            headerName: 'Worker',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'oneHour',
            headerName: '1 Hour',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'oneDay',
            headerName: '1 Day',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'sevenDay',
            headerName: '7 Day',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'lastUpdate',
            headerName: '7 Day',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
    ];

    // @ts-ignore
    return (
        <Container maxWidth={"xl"}>
            <Card className={styles.card} sx={{mt: 3}}>
                <CardHeader
                    className={styles.cardHeader}
                    title="Workers"
                    titleTypographyProps={{
                        style: {
                            fontSize: 17,
                            color: "#fff"
                        }
                    }}
                />
                <CardContent className={styles.cardContent}>
                    <Grid container sx={{mb: 1}}>
                        <Grid item xs={6}>
                            <Badge sx={{mr: 2}} color="secondary" badgeContent={status.all}>
                                <Button className={status.activeTab != 'all' ? styles.inactive : ''} variant={"contained"} onClick={() => applyFilter('all')}>All</Button>
                            </Badge>
                            <Badge sx={{mr: 2}} color="secondary" badgeContent={status.online}>
                                <Button className={status.activeTab != 'online' ? styles.inactive : ''} variant={"contained"} onClick={() => applyFilter('online')}>Online</Button>
                            </Badge>
                            <Badge sx={{mr: 2}} color="secondary" badgeContent={status.offline}>
                                <Button className={status.activeTab != 'offline' ? styles.inactive : ''} variant={"contained"} onClick={() => applyFilter('offline')}>Offline</Button>
                            </Badge>
                            <Badge sx={{mr: 2}} color="secondary" badgeContent={status.inactive}>
                                <Button className={status.activeTab != 'inactive' ? styles.inactive : ''} variant={"contained"} onClick={() => applyFilter('inactive')}>Inactive</Button>
                            </Badge>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: "right"}}>
                            <ButtonGroup variant="contained">
                                <Button onClick={openGroupModal}>Create Group</Button>
                                <Button onClick={openWatcherModal}>Create Watcher</Button>
                                <Button>Add Worker</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <div style={{display: 'flex', height: '100%', minHeight: 400}}>
                        <div style={{flexGrow: 1}}>
                            <DataGrid
                                rows={workers}
                                columns={columns}
                                rowsPerPageOptions={[10]}
                                autoPageSize={true}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={groupModal} onClose={closeGroupModal} maxWidth={"md"} fullWidth>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Group Name"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeGroupModal}>Cancel</Button>
                    <Button onClick={closeGroupModal}>Create</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={watcherModal} onClose={closeWatcherModal} maxWidth={"md"} fullWidth>
                <DialogTitle>Create New Watcher</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Watcher Name"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeWatcherModal}>Cancel</Button>
                    <Button onClick={closeWatcherModal}>Create</Button>
                </DialogActions>
            </Dialog>
        </Container>
);
}

export default WorkersList;
