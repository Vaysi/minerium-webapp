import type {NextPage} from 'next'
import {Backdrop, CircularProgress, Grid} from "@mui/material";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import WorkersList from "../components/workers/list_new";
import HashChart from "../components/workers/chart";
import Watchers from "../components/workers/watchers";
import {useEffect, useState} from "react";
import {$$workersGroups, $$workersList} from "../utils/api";
import {dynamicSort} from "../utils/functions";
import {WorkerGroups, WorkersGraph, WorkersList as WorkersListType} from "../utils/interfaces";
import WorkersGroup from "../components/workers/group";

const Workers: NextPage = () => {

    const [workers, setWorkers] = useState<Array<WorkersListType>>([]);

    const [visibleWorkers, setVisibleWorkers] = useState<Array<any>>([]);
    //@ts-ignore
    const [workerGraph, setWorkersGraph] = useState<WorkersGraph>(null);

    const [groups, setGroups] = useState<Array<WorkerGroups>>([]);

    const [selected, setSelected] = useState('all');

    // Workers Pagination
    const [since, setSince] = useState(1);

    const [page,setPage] = useState(0);

    const [selection,setSelection] = useState([]);


    useEffect(() => {
        getWorkersList();
        $$workersGroups().then(response => {
            setGroups(response.data);
        })
    }, []);

    useEffect(() => {
        getWorkersList();
    }, [since]);

    const getWorkersList = async (groupId: number | null = null) => {
        await $$workersList(groupId,since).then(response => {
            let rows = response.data.workers.map((item: any) => {
                item.id = item.worker_id;
                return item;
            });
            rows = rows.sort(dynamicSort('-hash1m'));
            setWorkers([...rows]);
            setVisibleWorkers([...rows]);
            setPage(0);
            setWorkersGraph({...response.data.graph});
        });
    };



    return (
        <Grid container>
            <Header/>
            {workers.length > 0 &&
            <WorkersList states={{groups, setGroups, getWorkersList, selected, setSelected,setVisibleWorkers,page,setPage,setSelection,visibleWorkers}} data={workers}/>}
            {Boolean(workerGraph) && <HashChart page={{page,setPage}} data={workerGraph} since={{since,setSince}} selection={{selection,setSelection}} visibleWorkers={visibleWorkers}/>}
            <Watchers />
            <Footer/>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={workers.length < 1}
            >
                <CircularProgress color="primary"/>
            </Backdrop>
        </Grid>
    );
};

export default Workers;
