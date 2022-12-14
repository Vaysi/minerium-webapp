import {
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid, IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import {
    DataGrid, GridApi,
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridColumnOrderChangeParams, GridFilterInputValueProps, GridFilterItem, GridFilterModel,
    GridFilterOperator,
    GridRenderCellParams,
    GridState,
    MuiEvent
} from '@mui/x-data-grid';
import {useEffect, useMemo, useRef, useState} from "react";
import {Hashrate} from "../../utils/functions";
import {WorkerGroups, WorkersList as WorkersListType} from "../../utils/interfaces";
import "../../styles/daragrid.module.css";
import {$$createWatcher, $$createWorkerGroup} from "../../utils/api";
import {toast} from "react-toastify";
import AddWorkerStepper from "./stepper";
import CustomCard from "../inline-components/card";
import SplitButton from "../inline-components/split-btn";
import SplitButtonState from "../inline-components/split-btn-status";
import {Circle, Close, Delete} from "@mui/icons-material";
import {useRouter} from "next/router";
import moment from "moment";

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

function FilterInput(props: GridFilterInputValueProps) {
    const classes = useStyles();
    const { item, applyValue } = props;
  
    const handleFilterChange = (event:any) => {
      applyValue({ ...item, value: event.target.value });
    };
  
    return (
      <div>
        <TextField style={{marginTop:"3px"}} label="Value" variant="standard" size="small" name="input-range" placeholder="Enter Value" value={item.value ? Number(item.value) : ""} onChange={handleFilterChange} />
      </div>
    );
  }

  function ZeroInput(props: GridFilterInputValueProps) {
    const classes = useStyles();
    const { item, applyValue } = props;
  
    const handleFilterChange = (event:any) => {
      applyValue({ ...item, value: event.target.value });
    };

    useEffect(() => {
        applyValue({ ...item, value: 2});
    },[]);
  
    return (
      <div>
        <TextField style={{display:"none"}} variant="standard" size="small" name="input-range" placeholder="Enter Value" value={1} onChange={handleFilterChange} />
      </div>
    );
  }

const isZeroOperator: GridFilterOperator = {
    label: 'is Zero',
    value: 'isZero',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
  
      return (params: GridCellParams): boolean => {
        return Number(params.value) < 1;
      };
    },
    InputComponent: ZeroInput,
    InputComponentProps: { type: 'number'},
};


const gtOperator: GridFilterOperator = {
    label: '>=',
    value: '>=',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
  
      return (params: GridCellParams): boolean => {
        return Number(params.value) >= Number(filterItem.value);
      };
    },
    InputComponent: FilterInput,
    InputComponentProps: { type: 'number' },
};

const ltOperator: GridFilterOperator = {
    label: '<=',
    value: '<=',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
  
      return (params: GridCellParams): boolean => {
        return Number(params.value) <= Number(filterItem.value);
      };
    },
    InputComponent: FilterInput,
    InputComponentProps: { type: 'number' },
};

interface Props {
    data: Array<WorkersListType>;
    states: {
        setGroups: any;
        groups: any;
        getWorkersList: any;
        selected: any;
        setSelected: any;
        setVisibleWorkers: any;
        page: number;
        setPage: any;
        setSelection: any;
        visibleWorkers: any;
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
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number>();
    const nineMatches = useMediaQuery('(max-width:980px)');
    const router = useRouter();
    const theme = useTheme();
    const [tableState,setTableState] = useState({
        sort: null,
        page: 0
    });
    //@ts-ignore
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => props.states.setSelection(selectionModel),[selectionModel]);
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
        let query = rows;
        switch (state) {
            case 'online':
                query = rows.filter(worker => worker.hash1m > 0);
                newState = 'online';
                break;
            case 'offline':
                query = rows.filter(worker => worker.hash5m === 0);
                newState = 'offline';
                break;
            case 'inactive':
                query = rows.filter(worker => worker.hash1d === 0);
                newState = 'inactive';
                break;
            default:
                query = rows;
                newState = 'all';
                break;
        }
        setWorkers(query);
        setStatus({...status, activeTab: newState});
    };


    const workersStatus = (data:any=null) => {
        let newRows = data || rows;
        let status = {
            all: newRows.length,
            online: 0,
            offline: 0,
            inactive: 0,
        };
        newRows.map((worker:any) => {
            status.online += worker.hash1m > 0 ? 1 : 0;
            status.offline += worker.hash5m === 0 ? 1 : 0;
            status.inactive += worker.hash1d === 0 ? 1 : 0;
        })
        return status;
    };

    useEffect(() => {
        setStatus({...status, ...workersStatus(props.data)});
        setWorkers([...props.data]);
        setRows([...props.data]);
    }, [props.data]);

    const tColumns: GridColDef[] = [
        {
            field: 'worker_name',
            headerName: 'Worker',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            renderCell: (params: GridRenderCellParams<Date>) => {
                return (
                    <strong style={{justifyContent: "left"}}>
                        <Circle style={{color: params.row.hash1m > 0 ? "green" : "red" , width:15,height:15,marginRight:5,position:"relative",top:3}} />
                        {matches ? params.row.worker_name.split(".")[1] : params.row.worker_name }
                    </strong>
                );
            },
            minWidth: 100
        },
        {
            field: 'hash1m',
            headerName: '1 Minute',
            flex: 1,
            align: "center",
            headerAlign: "center",
            renderCell: params => {
                return Hashrate(params.row.hash1m);
            },
            headerClassName: styles.headerTitle,
            type: "number",
            minWidth: 100,
            filterOperators: [gtOperator,ltOperator,isZeroOperator]
        },
        {
            field: 'hash1hr',
            headerName: '1 Hour',
            flex: 1,
            align: "center",
            headerAlign: "center",
            renderCell: params => {
                return Hashrate(params.row.hash1hr);
            },
            headerClassName: styles.headerTitle,
            type: "number",
            minWidth: 100,
            filterOperators: [gtOperator,ltOperator,isZeroOperator]
        },
        {
            field: 'hash1d',
            headerName: '1 Day',
            flex: 1,
            align: "center",
            headerAlign: "center",
            renderCell: params => {
                return Hashrate(params.row.hash1d);
            },
            headerClassName: styles.headerTitle,
            type: "number",
            minWidth: 100,
            filterOperators: [gtOperator,ltOperator,isZeroOperator]
        },
        {
            field: 'hash7d',
            headerName: '7 Day',
            flex: 1,
            align: "center",
            headerAlign: "center",
            renderCell: params => {
                return Hashrate(params.row.hash7d);
            },
            headerClassName: styles.headerTitle,
            type: "number",
            minWidth: 100,
            filterOperators: [gtOperator,ltOperator,isZeroOperator]
        },
        {
            field: 'lastupdate',
            headerName: 'Last Share',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            minWidth: 120,
            renderCell: params => {
                return moment.unix(params.row.lastupdate).format('YYYY-MM-DD HH:mm');
            },
        },
    ];

    function useApiRef() {
        const apiRef = useRef(null);
        const _columns = useMemo(
            () =>
                tColumns.concat({
                    field: "__HIDDEN__",
                    width: 0,
                    renderCell: (params) => {
                        //@ts-ignore
                        apiRef.current = params.api;
                        return null;
                    },
                    minWidth: 0,
                }),
            [tColumns]
        );

        return { apiRef, columns: _columns };
    }

    const { apiRef, columns } = useApiRef();


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
        return selectionModel.map(pItem => {
            let find = workers.filter(item => {
                //@ts-ignore
                return item.worker_id == pItem;
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

    useEffect(() => {
        if(router.isReady && router.query && rows.length){
            const {filter} = router.query;
            if(filter){
                applyFilter(filter as string)
            }
        }
    },[router.isReady,rows]);


    const updateVisibleWorkers = (page?:number) => {
        if(apiRef.current){
            let newRows = [];
            //@ts-ignore
            let currentRows = apiRef.current.getSortedRows();
            for (const currentRow of currentRows.entries()) {
                newRows.push(currentRow[1]);
            }
            let start = page ? page * 5 : 0;
            let end = newRows.length;
            props.states.setVisibleWorkers(page ? newRows.slice(start,end) : newRows);
        }else {
            let start = page ? page * 5 : 0;
            let end = workers.length;
            props.states.setVisibleWorkers(page ? workers.slice(start,end) : workers);
        }
    };

    useEffect(() => {
        if(apiRef.current){
            //@ts-ignore
            apiRef.current.setPage(props.states.page);
        }
    },[props.states.page])

    useEffect(() => {
        setTimeout(() => updateVisibleWorkers(),1000);
    },[]);

    useEffect(() => {
        updateVisibleWorkers();
    },[workers]);

    const match415 = useMediaQuery('(max-width:415px)');

    const handleClickOpen = (groupId: number) => {
        setSelected(groupId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <CustomCard titleProps={{
                title: "Workers"
                , action: (
                    <FormControl className={"groupFilter"} style={{backgroundColor: "#fff", borderRadius: 25, minWidth: 100,marginRight:10}}>
                        <Select
                            id="groupSelect"
                            value={props.states.selected}
                            variant={"outlined"}
                            onChange={(e) => props.states.setSelected(e.target.value)}
                            classes={{select: styles.select}}
                            className={styles.selector}
                            size={"small"}
                        >
                            <MenuItem value={'all'}>All&nbsp;&nbsp;&nbsp;</MenuItem>
                            {props.states.groups.map((item: WorkerGroups) => (
                                <MenuItem sx={{justifyContent:"space-between"}} value={item.id} key={item.id}>{item.name} 
                                <IconButton edge="end" aria-label="comments">
                                 <Delete onClick={() => handleClickOpen(item.id)}/>
                                 </IconButton>
                                </MenuItem>))}
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
                <div style={{display: 'flex', height: '100%', minHeight: matches ? 300 : 400}}>
                    <div style={{flexGrow: 1,width:"100%"}} className={"tableContainer workersTable"}>
                        <DataGrid
                            rows={workers}
                            columns={columns}
                            rowsPerPageOptions={[5]}
                            autoPageSize={true}
                            pageSize={5}
                            page={props.states.page}
                            density={matches ? "compact" : "standard"}
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                // @ts-ignore
                                setSelectionModel(newSelectionModel);
                            }}
                            selectionModel={selectionModel}
                            onSortModelChange={() => {
                                setTimeout(() => {
                                    if(apiRef.current){
                                        //@ts-ignore
                                        apiRef.current.setPage(0);
                                    }
                                    updateVisibleWorkers();
                                },1000);
                            }}
                            onPageChange={(page,details) => {
                                props.states.setPage(page);
                                updateVisibleWorkers(page);
                            }}
                            onStateChange={match415 ? (state) => {
                                if(state.sorting.sortModel != tableState.sort){
                                    let newState = {...tableState};
                                    // @ts-ignore
                                    newState.sort = state.sorting.sortModel;
                                    setTableState(newState)
                                    let sortedRowsIds = state.sorting.sortedRows;
                                    let tableRows = state.rows.idRowsLookup;
                                    let newData:any = [];
                                    sortedRowsIds.map((item:any) => {
                                        newData.push(tableRows[item]);
                                    });
                                    //@ts-ignore
                                    if(newData != props.states.visibleWorkers){
                                        //@ts-ignore
                                        props.states.setVisibleWorkers(newData);
                                    }
                                }
                            } : undefined}
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
            <Dialog PaperProps={{
                sx: {
                    py:0
                }
            }} open={addWorkerModal} onClose={closeAddWorkerModal} maxWidth={"md"} fullWidth>
                <DialogTitle>
                    <Typography variant={"h5"} style={{fontWeight: "bold"}} align={"center"}>
                        Adding More Workers!
                        <IconButton sx={{float:"right"}} aria-label="close" onClick={closeAddWorkerModal}>
                            <Close />
                        </IconButton>
                    </Typography>
                    <Typography variant={"h6"} align={"center"}>
                        Please follow these steps to configure your new workers:
                    </Typography>
                    <Divider/>
                </DialogTitle>
                <DialogContent>
                    <AddWorkerStepper/>
                </DialogContent>
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
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    Remove Group
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this Group ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Yes</Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default WorkersList;
