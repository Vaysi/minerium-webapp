import {
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import {Hashrate} from "../../utils/functions";
import {WorkerGroups, WorkersList as WorkersListType} from "../../utils/interfaces";
import "../../styles/daragrid.module.css";
import {$$createWatcher, $$createWorkerGroup} from "../../utils/api";
import {toast} from "react-toastify";
import AddWorkerStepper from "./stepper";
import CustomCard from "../inline-components/card";
import SplitButton from "../inline-components/split-btn";
import SplitButtonState from "../inline-components/split-btn-status";
import {Circle} from "@mui/icons-material";

const useStyles: any = makeStyles((theme: any) => ({
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
        },
        paddingRight: 25
    },
    selector: {
        "& fieldset": {
            display: "none"
        },
        "& 	.MuiSelect-outlined": {
            backgroundColor: "#fff",
        }
    }
}));

interface Props {
    data: Array<WorkersListType>;
    states: {
        setGroups: any;
        groups: any;
        getWorkersList: any;
        selected: any;
        setSelected: any;
    }
}

const WorkersList = (props: Props) => {
    const styles = useStyles();
    const [workers, setWorkers] = useState<Array<WorkersListType>>([...props.data]);
    const [rows, setRows] = useState<Array<WorkersListType>>([...props.data]);
    const [groupModal, setGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [watcherName, setWatcherName] = useState('');
    const [watcherModal, setWatcherModal] = useState(false);
    const [addWorkerModal, setAddWorkerModal] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const [watcherLink, setWatcherLink] = useState(null);
    const nineMatches = useMediaQuery('(max-width:980px)');


    const openGroupModal = () => {
        if (selectionModel.length) {
            setGroupModal(true);
        } else {
            toast.error('Please Select a Worker First , Click Here Again');
        }
    };

    const closeGroupModal = () => {
        setGroupModal(false);
    };

    const openWatcherModal = () => {
        if (props.states.selected != 'all') {
            setWatcherModal(true);
        } else {
            toast.error('Please Select a Group from Top To Create a Watcher');
        }
    };

    const closeWatcherModal = () => {
        setWatcherModal(false);
    };

    const openAddWorkerModal = () => {
        setAddWorkerModal(true);
    };

    const closeAddWorkerModal = () => {
        setAddWorkerModal(false);
    };

    useEffect(() => setWatcherLink(null), [watcherModal]);

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
                setWorkers(rows.filter(worker => worker.hash1m > 0));
                newState = 'online';
                break;
            case 'offline':
                setWorkers(rows.filter(worker => worker.hash5m === 0));
                newState = 'offline';
                break;
            case 'inactive':
                setWorkers(rows.filter(worker => worker.hash1d === 0));
                newState = 'inactive';
                break;
            default:
                setWorkers(rows);
                newState = 'all';
                break;
        }
        setStatus({...status, activeTab: newState});
    };


    const workersStatus = () => {
        let status = {
            all: rows.length,
            online: 0,
            offline: 0,
            inactive: 0,
        };
        rows.map(worker => {
            status.online += worker.hash1m > 0 ? 1 : 0;
            status.offline += worker.hash5m === 0 ? 1 : 0;
            status.inactive += worker.hash1d === 0 ? 1 : 0;
        })
        return status;
    };

    useEffect(() => {
        setStatus({...status, ...workersStatus()});
        setWorkers([...props.data]);
        setRows([...props.data]);
    }, [props.data]);

    const columns: GridColDef[] = [
        {
            field: 'worker_name',
            headerName: 'Worker',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            renderCell: (params: GridRenderCellParams<Date>) => {
                return (
                    <strong>
                        <Circle style={{color: params.row.hash1m > 0 ? "green" : "red" , width:15,height:15,marginRight:5,position:"relative",top:3}} />
                        {params.row.worker_name}
                    </strong>
                );
            },
        },
        {
            field: 'hash1m',
            headerName: '1 Minute',
            flex: 1,
            align: "center",
            headerAlign: "center",
            valueGetter: params => {
                return Hashrate(params.row.hash1m);
            },
            headerClassName: styles.headerTitle,
        },
        {
            field: 'hash1hr',
            headerName: '1 Hour',
            flex: 1,
            align: "center",
            headerAlign: "center",
            valueGetter: params => {
                return Hashrate(params.row.hash1hr);
            },
            headerClassName: styles.headerTitle
        },
        {
            field: 'hash1d',
            headerName: '1 Day',
            flex: 1,
            align: "center",
            headerAlign: "center",
            valueGetter: params => {
                return Hashrate(params.row.hash1d);
            },
            headerClassName: styles.headerTitle
        },
        {
            field: 'hash7d',
            headerName: '7 Day',
            flex: 1,
            align: "center",
            headerAlign: "center",
            valueGetter: params => {
                return Hashrate(params.row.hash7d);
            },
            headerClassName: styles.headerTitle
        },
        {
            field: 'lastupdate',
            headerName: 'Last Update',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
    ];

    const createGroup = () => {
        $$createWorkerGroup(groupName, getWorkersNameById()).then((response) => {
            setGroupName('');
            props.states.setGroups([...props.states.groups, {...response.data}]);
            toast.success('Group Created Successfully');
            setGroupModal(false);
        });
    };

    const createWatcher = () => {
        $$createWatcher(watcherName, props.states.selected).then((response) => {
            setWatcherName('');
            setWatcherLink(response.data.token);
            toast.success('Watcher Created Successfully');
        });
    };

    const getWorkersNameById = () => {
        return selectionModel.map(item => {
            let find = workers.filter(item => {
                //@ts-ignore
                return selectionModel.includes(item.worker_id);
            });
            if (find.length) {
                return find[0].worker_name;
            }
        });
    };


    useEffect(() => {
        if (props.states.selected == 'all') {
            props.states.getWorkersList();
        } else {
            props.states.getWorkersList(props.states.selected);
        }
    }, [props.states.selected]);

    return (
        <>
            <CustomCard titleProps={{
                title: "Workers"
                , action: (
                    <FormControl style={{backgroundColor: "#fff", borderRadius: 25, minWidth: 100,marginRight:10}}>
                        <Select
                            id="groupSelect"
                            value={props.states.selected}
                            variant={"outlined"}
                            onChange={(e) => props.states.setSelected(e.target.value)}
                            classes={{select: styles.select}}
                            className={styles.selector}
                        >
                            <MenuItem value={'all'}>All&nbsp;&nbsp;&nbsp;</MenuItem>
                            {props.states.groups.map((item: WorkerGroups) => (
                                <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>))}
                        </Select>
                    </FormControl>
                )
            }}>
                <Grid container sx={{mb: 1}}>
                    <Grid item xs={6}>
                        {
                            nineMatches ? (
                                <SplitButtonState options={[
                                    {
                                        text:"All",
                                        action: () => applyFilter('all'),
                                        badge: status.all,
                                    },
                                    {
                                        text: "Online",
                                        action: () => applyFilter('online'),
                                        badge: status.online,
                                    },
                                    {
                                        text: "Offline",
                                        action: () => applyFilter('offline'),
                                        badge: status.offline,
                                    },
                                    {
                                        text: "Inactive",
                                        action: () => applyFilter('inactive'),
                                        badge: status.inactive
                                    }
                                ]}/>
                            ) : (
                                <>
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary" badgeContent={status.all}>
                                        <Button className={status.activeTab != 'all' ? styles.inactive : 'badgeBTN'}
                                                variant={"contained"} onClick={() => applyFilter('all')}>All</Button>
                                    </Badge>
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary" badgeContent={status.online}>
                                        <Button className={status.activeTab != 'online' ? styles.inactive : 'badgeBTN'}
                                                variant={"contained"}
                                                onClick={() => applyFilter('online')}>Online</Button>
                                    </Badge>
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary" badgeContent={status.offline}>
                                        <Button className={status.activeTab != 'offline' ? styles.inactive : 'badgeBTN'}
                                                variant={"contained"}
                                                onClick={() => applyFilter('offline')}>Offline</Button>
                                    </Badge>
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary" badgeContent={status.inactive}>
                                        <Button className={status.activeTab != 'inactive' ? styles.inactive : 'badgeBTN'}
                                                variant={"contained"}
                                                onClick={() => applyFilter('inactive')}>Inactive</Button>
                                    </Badge>
                                </>
                            )
                        }
                    </Grid>
                    <Grid item xs={6}
                          style={{display: "flex", justifyContent:  "flex-end" }}>
                        {
                            nineMatches ? (
                                <SplitButton options={[
                                    {
                                        text: "Create Group",
                                        action: openGroupModal,
                                    },
                                    {
                                        text: "Create Watcher",
                                        action: openWatcherModal,
                                    },
                                    {
                                        text: "Add Worker",
                                        action: openAddWorkerModal,
                                    }
                                ]}/>
                            ) : (
                                <>
                                    <Button sx={{ml:2}} onClick={openGroupModal} variant={"contained"}>Create Group</Button>
                                    <Button sx={{ml:2}} onClick={openWatcherModal} variant={"contained"}>Create Watcher</Button>
                                    <Button sx={{ml:2}} onClick={openAddWorkerModal} variant={"contained"}>Add Worker</Button>
                                </>
                            )
                        }
                    </Grid>
                </Grid>
                <div style={{display: 'flex', height: '100%', minHeight: 400}}>
                    <div style={{flexGrow: 1}}>
                        <DataGrid
                            rows={workers}
                            columns={columns}
                            rowsPerPageOptions={[10]}
                            autoPageSize={true}
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                // @ts-ignore
                                setSelectionModel(newSelectionModel);
                            }}
                            selectionModel={selectionModel}
                        />
                    </div>
                </div>
            </CustomCard>
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
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeGroupModal}>Cancel</Button>
                    <Button onClick={createGroup}>Create</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addWorkerModal} onClose={closeAddWorkerModal} maxWidth={"md"} fullWidth>
                <DialogTitle>
                    <Typography variant={"h5"} style={{fontWeight: "bold"}} align={"center"}>
                        Adding More Workers!
                    </Typography>
                    <Typography variant={"h6"} align={"center"}>
                        Please follow these steps to configure your new workers:
                    </Typography>
                    <Divider/>
                </DialogTitle>
                <DialogContent>
                    <AddWorkerStepper/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddWorkerModal}>Close</Button>
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
                        value={watcherName}
                        onChange={e => setWatcherName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeWatcherModal}>Cancel</Button>
                    <Button onClick={createWatcher}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default WorkersList;
