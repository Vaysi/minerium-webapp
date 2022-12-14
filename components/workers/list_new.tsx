import {
    Backdrop,
    Badge,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {makeStyles, styled, useTheme} from "@mui/styles";
import {useEffect, useRef, useState} from "react";
import {Hashrate} from "../../utils/functions";
import {WorkerGroups, WorkersList as WorkersListType} from "../../utils/interfaces";
import "../../styles/daragrid.module.css";
import {$$createWatcher, $$createWorkerGroup} from "../../utils/api";
import {toast} from "react-toastify";
import AddWorkerStepper from "./stepper";
import CustomCard from "../inline-components/card";
import SplitButton from "../inline-components/split-btn";
import SplitButtonState from "../inline-components/split-btn-status";
import {ArrowDownward, ArrowUpward, Circle, Close, Delete, FilterAlt, MoreVert} from "@mui/icons-material";
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

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#043386",
        color: "#fff",
        fontFamily: "var(--font-body)",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: "#043180"
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        // @ts-ignore
        backgroundColor: theme.palette.action.hover,
    },
}));

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
    const [selectionModel, setSelectionModel] = useState<any>([]);
    const [selectedColumn, setSelectedColumn] = useState('worker_name');
    const [showMenu, setShowMenu] = useState(null);
    const [sortModel, setSortModel] = useState<null | string>(null);
    const [sorted, setSorted] = useState(false);
    const [sortedColumn, setSortedColumn] = useState('');
    const [sortToggleIcon, setSortToggleIcon] = useState('');
    const [filterPopover, setFilterPopover] = useState(null);
    const header = useRef(null);
    const columns = [
        {
            name: 'Worker',
            type: 'string',
            value: 'worker_name'
        },
        {
            name: '1 Minute',
            type: 'number',
            value: 'hash1m'
        },
        {
            name: '1 Hour',
            type: 'number',
            value: 'hash1hr'
        },
        {
            name: '1 Day',
            type: 'number',
            value: 'hash1d'
        },
        {
            name: '7 Day',
            type: 'number',
            value: 'hash7day'
        },
        {
            name: 'Last Share',
            type: 'string',
            value: 'lastupdate'
        }
    ];

    const operators = {
        number: [
            {
                name: '>=',
                value: '>='
            },
            {
                name: '<=',
                value: '<='
            },
            {
                name: 'is Zero',
                value: 'isZero',
            }
        ],
        string: [
            {
                name: 'Contains',
                value: 'contains'
            },
            {
                name: 'Equals',
                value: 'equals'
            },
            {
                name: 'Starts With',
                value: 'starts'
            },
            {
                name: 'Ends With',
                value: 'ends'
            }
        ]
    };

    const [column, setColumn] = useState('worker_name');
    const [operator, setOperator] = useState('contains');
    const [filterValue, setFilterValue] = useState('');
    const [filtered, setFiltered] = useState(false);

    const handleClick = (event: any) => {
        setShowMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setShowMenu(null);
    };

    const [watcherLink, setWatcherLink] = useState(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number>();
    const nineMatches = useMediaQuery('(max-width:980px)');
    const router = useRouter();
    const theme = useTheme();

    //@ts-ignore
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        props.states.setSelection(selectionModel);
    }, [selectionModel]);
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


    const workersStatus = (data: any = null) => {
        let newRows = data || rows;
        let status = {
            all: newRows.length,
            online: 0,
            offline: 0,
            inactive: 0,
        };
        newRows.map((worker: any) => {
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
        return selectionModel.map((pItem: any) => {
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
        if (router.isReady && router.query && rows.length) {
            const {filter} = router.query;
            if (filter) {
                applyFilter(filter as string)
            }
        }
    }, [router.isReady, rows]);


    const updateVisibleWorkers = (page?: number) => {
        let start = page ? page * 5 : 0;
        let end = workers.length;
        props.states.setVisibleWorkers(page ? [...workers.slice(start, end)] : [...workers]);
    };

    useEffect(() => {
        updateVisibleWorkers();
    }, [workers]);

    const match415 = useMediaQuery('(max-width:415px)');

    const handleClickOpen = (groupId: number) => {
        setSelected(groupId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const preSort = (selectedColumn: string, sortModel: string) => {
        if (sortModel == 'zta') {
            return function (a: any, b: any) {
                if (a[selectedColumn] < b[selectedColumn]) {
                    return -1;
                }
                if (a[selectedColumn] > b[selectedColumn]) {
                    return 1;
                }
                return 0
            };
        } else {
            return function (a: any, b: any) {
                if (a[selectedColumn] > b[selectedColumn]) {
                    return -1;
                }
                if (a[selectedColumn] < b[selectedColumn]) {
                    return 1;
                }
                return 0;
            };
        }
    }

    const sortZtA = (column?: string) => {
        setSortModel('zta');
        setSortedColumn(column ?? selectedColumn);
        props.states.setVisibleWorkers([...props.data.sort(preSort(column ?? selectedColumn, 'zta'))]);
        setSorted(true);
        setShowMenu(null);
    };

    const sortAtZ = (column?: string) => {
        setSortModel('atz');
        setSortedColumn(column ?? selectedColumn);
        props.states.setVisibleWorkers([...props.data.sort(preSort(column ?? selectedColumn, 'atz'))]);
        setSorted(true);
        setShowMenu(null);
    };

    const unSort = () => {
        setSortModel(null);
        setSortedColumn('');
        props.states.setVisibleWorkers([...props.data]);
        setSorted(false);
        setShowMenu(null);
    };

    const showSortIcon = (column: string) => {
        if (column == sortedColumn && sorted) {
            if (sortModel == 'atz') {
                return <IconButton onClick={() => sortZtA(column)} style={{color: '#fff'}}>
                    <ArrowUpward/>
                </IconButton>;
            } else {
                return <IconButton onClick={() => unSort()} style={{color: '#fff'}}>
                    <ArrowDownward/>
                </IconButton>;
            }
        } else if (sortToggleIcon == column) {
            return <IconButton onClick={() => {
                sortAtZ(column);
            }} style={{color: '#fff'}}>
                <ArrowUpward/>
            </IconButton>;
        }
        return <></>;
    }

    const showFilterIcon = (filterColumn: string) => {
        if (filterColumn == column && filtered && filterValue) {
            return <IconButton onClick={() => {
                setFiltered(false);
                setFilterValue('');
                props.states.setVisibleWorkers(props.data);
            }} style={{color: '#fff'}}>
                <FilterAlt/>
            </IconButton>;
        }
    }

    const showSortIconButton = (column: string) => {
        setSortToggleIcon(column);
    };

    const hideSortIconButton = () => {
        setSortToggleIcon('');
    };

    useEffect(() => {
        if (columns.filter(item => item.value == column).length) {
            if (columns.filter(item => item.value == column)[0].type == 'string') {
                setOperator('contains');
            } else {
                setOperator('>=');
            }
        }
    }, [column]);

    useEffect(() => {
        if (filterValue) {
            let filterType = columns.filter(item => item.value == column)[0].type;
            let rows = props.data.filter((item: any) => {
                if (filterType == 'string' && item[column]) {
                    if (operator == 'contains') {
                        return item[column].includes(filterValue);
                    } else if (operator == 'equals') {
                        return item[column] == filterValue;
                    } else if (operator == 'starts') {
                        return item[column].startsWith(filterValue);
                    } else if (operator == 'ends') {
                        return item[column].endsWith(filterValue);
                    }
                } else {
                    if (operator == '>=') {
                        return item[column] >= filterValue;
                    } else if (operator == '<=') {
                        return item[column] <= filterValue;
                    } else if (operator == 'isZero') {
                        return item[column] == 0;
                    }
                }
            });
            props.states.setVisibleWorkers([...rows]);
            props.states.setPage(0);
            setFiltered(true);
        }else {
            setFiltered(false);
        }
    }, [filterValue]);

    useEffect(() => {
        if (operator == 'isZero') {
            setFilterValue('1');
        }
    }, [operator]);


    return (
        <>
            <CustomCard titleProps={{
                title: "Workers"
                , action: (
                    <FormControl className={"groupFilter"}
                                 style={{backgroundColor: "#fff", borderRadius: 25, minWidth: 100, marginRight: 10}}>
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
                                <MenuItem sx={{justifyContent: "space-between"}} value={item.id}
                                          key={item.id}>{item.name}
                                    <IconButton className={"hideOnSelect"} edge="end" aria-label="comments">
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
                                        text: "All",
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
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary"
                                           badgeContent={status.all}>
                                        <Button className={status.activeTab != 'all' ? styles.inactive : 'badgeBTN'}
                                                variant={"contained"} onClick={() => applyFilter('all')}>All</Button>
                                    </Badge>
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary"
                                           badgeContent={status.online}>
                                        <Button className={status.activeTab != 'online' ? styles.inactive : 'badgeBTN'}
                                                variant={"contained"}
                                                onClick={() => applyFilter('online')}>Online</Button>
                                    </Badge>
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary"
                                           badgeContent={status.offline}>
                                        <Button className={status.activeTab != 'offline' ? styles.inactive : 'badgeBTN'}
                                                variant={"contained"}
                                                onClick={() => applyFilter('offline')}>Offline</Button>
                                    </Badge>
                                    <Badge className={"badgeContainer"} sx={{mr: 2}} color="secondary"
                                           badgeContent={status.inactive}>
                                        <Button
                                            className={status.activeTab != 'inactive' ? styles.inactive : 'badgeBTN'}
                                            variant={"contained"}
                                            onClick={() => applyFilter('inactive')}>Inactive</Button>
                                    </Badge>
                                </>
                            )
                        }
                    </Grid>
                    <Grid item xs={6}
                          style={{display: "flex", justifyContent: "flex-end"}}>
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
                                    <Button sx={{ml: 2}} onClick={openGroupModal} variant={"contained"}>Create
                                        Group</Button>
                                    <Button sx={{ml: 2}} onClick={openWatcherModal} variant={"contained"}>Create
                                        Watcher</Button>
                                    <Button sx={{ml: 2}} onClick={openAddWorkerModal} variant={"contained"}>Add
                                        Worker</Button>
                                </>
                            )
                        }
                    </Grid>
                </Grid>
                <div style={{display: 'flex', height: '100%', minHeight: matches ? 300 : 400}}>
                    <div style={{flexGrow: 1, width: "100%"}} className={"tableContainer workersTable"}>
                        <TableContainer style={{border: "1px solid #043386", borderRadius: 10}} component={Paper}
                                        className={"tableContainer " + styles.parent}
                                        sx={{backgroundColor: "transparent"}}>
                            {rows.length < 1 && (
                                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, px: 5, py: 5}}
                                          className={styles.backdrop} open={rows.length < 1}>
                                    <CircularProgress color="inherit"/>
                                </Backdrop>
                            )}
                            <Table sx={{minWidth: 700}} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell className={styles.thead} align="left"
                                                         style={{width: "4%"}}><Checkbox disabled/></StyledTableCell>
                                        <StyledTableCell onMouseOver={() => showSortIconButton('worker_name')}
                                                         onMouseLeave={hideSortIconButton} className={styles.thead}
                                                         align="left">
                                            <Box display={"flex"} alignItems={"center"}
                                                 justifyContent={"space-between"}>
                                                <Box>
                                                    Worker
                                                    {
                                                        showSortIcon('worker_name')
                                                    }
                                                    {
                                                        showFilterIcon('worker_name')
                                                    }
                                                </Box>
                                                <IconButton
                                                    onClick={(e: any) => {
                                                        setSelectedColumn('worker_name');
                                                        handleClick(e);
                                                    }}
                                                    style={{color: "#fff"}}
                                                    aria-label="show menu" component="span">
                                                    <MoreVert/>
                                                </IconButton>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell onMouseOver={() => showSortIconButton('hash1m')}
                                                         onMouseLeave={hideSortIconButton} className={styles.thead}
                                                         align="center">
                                            <Box display={"flex"} alignItems={"center"}
                                                 justifyContent={"space-between"}>
                                                <Box>
                                                    &nbsp;
                                                </Box>
                                                <Box mr={"-20px"}>
                                                    1 Minute
                                                    {
                                                        showSortIcon('hash1m')
                                                    }
                                                    {
                                                        showFilterIcon('hash1m')
                                                    }
                                                </Box>
                                                <IconButton
                                                    onClick={(e: any) => {
                                                        setSelectedColumn('hash1m');
                                                        handleClick(e);
                                                    }}
                                                    style={{color: "#fff"}}
                                                    aria-label="show menu" component="span">
                                                    <MoreVert/>
                                                </IconButton>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell onMouseOver={() => showSortIconButton('hash1hr')}
                                                         onMouseLeave={hideSortIconButton} className={styles.thead}
                                                         align="center">
                                            <Box display={"flex"} alignItems={"center"}
                                                 justifyContent={"space-between"}>
                                                <Box>
                                                    &nbsp;
                                                </Box>
                                                <Box mr={"-20px"}>
                                                    1 Hour
                                                    {
                                                        showSortIcon('hash1hr')
                                                    }
                                                    {
                                                        showFilterIcon('hash1hr')
                                                    }
                                                </Box>
                                                <IconButton
                                                    onClick={(e: any) => {
                                                        setSelectedColumn('hash1hr');
                                                        handleClick(e);
                                                    }}
                                                    style={{color: "#fff"}}
                                                    aria-label="show menu" component="span">
                                                    <MoreVert/>
                                                </IconButton>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell onMouseOver={() => showSortIconButton('hash1d')}
                                                         onMouseLeave={hideSortIconButton} className={styles.thead}
                                                         align="center">
                                            <Box display={"flex"} alignItems={"center"}
                                                 justifyContent={"space-between"}>
                                                <Box>
                                                    &nbsp;
                                                </Box>
                                                <Box mr={"-20px"}>
                                                    1 Day
                                                    {
                                                        showSortIcon('hash1d')
                                                    }
                                                    {
                                                        showFilterIcon('hash1d')
                                                    }
                                                </Box>
                                                <IconButton
                                                    onClick={(e: any) => {
                                                        setSelectedColumn('hash1d');
                                                        handleClick(e);
                                                    }}
                                                    style={{color: "#fff"}}
                                                    aria-label="show menu" component="span">
                                                    <MoreVert/>
                                                </IconButton>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell onMouseOver={() => showSortIconButton('hash7d')}
                                                         onMouseLeave={hideSortIconButton} className={styles.thead}
                                                         align="center">
                                            <Box display={"flex"} alignItems={"center"}
                                                 justifyContent={"space-between"}>
                                                <Box>
                                                    &nbsp;
                                                </Box>
                                                <Box mr={"-20px"}>
                                                    7 Day
                                                    {
                                                        showSortIcon('hash7d')
                                                    }
                                                    {
                                                        showFilterIcon('hash7d')
                                                    }
                                                </Box>
                                                <IconButton
                                                    onClick={(e: any) => {
                                                        setSelectedColumn('hash7d');
                                                        handleClick(e);
                                                    }}
                                                    style={{color: "#fff"}}
                                                    aria-label="show menu" component="span">
                                                    <MoreVert/>
                                                </IconButton>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell onMouseOver={() => showSortIconButton('lastupdate')}
                                                         onMouseLeave={hideSortIconButton} className={styles.thead}
                                                         align="center">
                                            <Box display={"flex"} alignItems={"center"}
                                                 justifyContent={"space-between"}>
                                                <Box>
                                                    &nbsp;
                                                </Box>
                                                <Box mr={"-20px"}>
                                                    Last Share
                                                    {
                                                        showSortIcon('lastupdate')
                                                    }
                                                    {
                                                        showFilterIcon('lastupdate')
                                                    }
                                                </Box>
                                                <IconButton
                                                    onClick={(e: any) => {
                                                        setSelectedColumn('lastupdate');
                                                        handleClick(e);
                                                    }}
                                                    style={{color: "#fff"}}
                                                    aria-label="show menu" component="span">
                                                    <MoreVert/>
                                                </IconButton>
                                            </Box>
                                        </StyledTableCell>
                                    </TableRow>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={showMenu}
                                        open={Boolean(showMenu)}
                                        onClose={handleCloseMenu}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem disabled={!sorted} onClick={unSort}>Unsort</MenuItem>
                                        <MenuItem disabled={sorted && sortModel == 'zta'}
                                                  onClick={() => sortZtA(selectedColumn)}>Sort Z to
                                            A</MenuItem>
                                        <MenuItem disabled={sorted && sortModel == 'atz'}
                                                  onClick={() => sortAtZ(selectedColumn)}>Sort A to
                                            Z</MenuItem>
                                        <MenuItem onClick={() => {
                                            setFilterPopover(header.current);
                                            setShowMenu(null);
                                            setColumn(selectedColumn);
                                        }}>Filter</MenuItem>
                                    </Menu>
                                </TableHead>
                                <TableBody ref={header}>
                                    {props.states.visibleWorkers.length ?
                                        (
                                            props.states.visibleWorkers.slice(props.states.page * 5, props.states.page * 5 + 5).map((item: any, i: number) => (
                                                <StyledTableRow key={item.id}>
                                                    <StyledTableCell align={"left"} style={{fontWeight: "bold"}}>
                                                        <Checkbox className={`checkbox_${i}`} onChange={e => {
                                                            if (e.target.checked) {
                                                                let newSelection = [...selectionModel];
                                                                // @ts-ignore
                                                                newSelection.push(item.worker_id);
                                                                // @ts-ignore
                                                                setSelectionModel([...new Set(newSelection)]);
                                                            } else {
                                                                let newSelection = [...selectionModel].filter(subItem => subItem != item.id);
                                                                // @ts-ignore
                                                                setSelectionModel([...new Set(newSelection)]);
                                                            }
                                                        }}/>
                                                    </StyledTableCell>
                                                    <StyledTableCell className={styles.thead} align="left">
                                                        <strong style={{justifyContent: "left"}}>
                                                            <Circle style={{
                                                                color: item.hash1m > 0 ? "green" : "red",
                                                                width: 15,
                                                                height: 15,
                                                                marginRight: 5,
                                                                position: "relative",
                                                                top: 3
                                                            }}/>
                                                            {matches ? item.worker_name.split(".")[1] : item.worker_name}
                                                        </strong>
                                                    </StyledTableCell>
                                                    <StyledTableCell className={styles.thead}
                                                                     align="center">{Hashrate(item.hash1m)}</StyledTableCell>
                                                    <StyledTableCell className={styles.thead}
                                                                     align="center">{Hashrate(item.hash1hr)}</StyledTableCell>
                                                    <StyledTableCell className={styles.thead}
                                                                     align="center">{Hashrate(item.hash1d)}</StyledTableCell>
                                                    <StyledTableCell className={styles.thead}
                                                                     align="center">{Hashrate(item.hash7d)}</StyledTableCell>
                                                    <StyledTableCell className={styles.thead}
                                                                     align="center">{moment.unix(item.lastupdate).format('YYYY-MM-DD HH:mm')}</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        )
                                        : undefined
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={workers.length}
                            page={props.states.page}
                            onPageChange={(event, page) => {
                                props.states.setPage(page);
                            }}
                            rowsPerPage={5}
                            labelRowsPerPage={""}
                            rowsPerPageOptions={[]}
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
                    py: 0
                }
            }} open={addWorkerModal} onClose={closeAddWorkerModal} maxWidth={"md"} fullWidth>
                <DialogTitle>
                    <Typography variant={"h5"} style={{fontWeight: "bold"}} align={"center"}>
                        Adding More Workers!
                        <IconButton sx={{float: "right"}} aria-label="close" onClick={closeAddWorkerModal}>
                            <Close/>
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
            <Popover
                id={'filter'}
                open={Boolean(filterPopover)}
                anchorEl={filterPopover}
                onClose={() => setFilterPopover(null)}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
            >
                <Box display={"flex"} alignItems={"center"}>
                    <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-standard-label">Column</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Column"
                            defaultValue={column}
                            value={column}
                            onChange={(e) => setColumn(e.target.value)}
                        >
                            <MenuItem value={'worker_name'}>Worker</MenuItem>
                            <MenuItem value={'hash1m'}>1 Minute</MenuItem>
                            <MenuItem value={'hash1hr'}>1 Hour</MenuItem>
                            <MenuItem value={'hash1d'}>1 Day</MenuItem>
                            <MenuItem value={'hash7d'}>7 Day</MenuItem>
                            <MenuItem value={'lastupdate'}>Last Share</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="operator">Operator</InputLabel>
                        <Select
                            labelId="operator"
                            label="Operator"
                            defaultValue={operator}
                            value={operator}
                            onChange={(e) => setOperator(e.target.value)}
                        >
                            {
                                columns.filter(item => item.value == column).length && columns.filter(item => item.value == column)[0].type == 'string' ?
                                    operators.string.map((item,index) => <MenuItem key={index} value={item.value}>{item.name}</MenuItem>)
                                    : operators.number.map((item,index) => <MenuItem key={index} value={item.value}>{item.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <TextField disabled={operator == 'isZero'} label={'Filter Value'} variant={'standard'}
                               value={filterValue} onChange={(e) => setFilterValue(e.target.value)}/>
                </Box>
            </Popover>
        </>
    );
}

export default WorkersList;
