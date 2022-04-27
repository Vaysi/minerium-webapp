import type {NextPage} from 'next'
import {Backdrop, CircularProgress, Grid} from "@mui/material";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import WorkersList from "../components/workers/list";
import HashChart from "../components/workers/chart";
import {useEffect, useState} from "react";
import {$$workersGroups, $$workersList} from "../utils/api";
import {dynamicSort} from "../utils/functions";
import {WorkerGroups, WorkersGraph, WorkersList as WorkersListType} from "../utils/interfaces";
import WorkersGroup from "../components/workers/group";

const Workers: NextPage = () => {

    const [workers, setWorkers] = useState<Array<WorkersListType>>([]);
    //@ts-ignore
    const [workerGraph, setWorkersGraph] = useState<WorkersGraph>(null);

    const [groups, setGroups] = useState<Array<WorkerGroups>>([]);

    const [selected, setSelected] = useState('all');

    // Workers Pagination
    const [since, setSince] = useState(1);


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
                let time = new Date(item.lastupdate * 1000);
                item.lastupdate = `${time.getFullYear()}-${time.getMonth()}-${time.getDay()} ${time.getHours()}:${time.getMinutes()}`;
                return item;
            });
            rows = rows.sort(dynamicSort('-hash1m'));
            setWorkers([...rows]);
            setWorkersGraph({...response.data.graph});
        });
    };


    return (
        <Grid container>
            <Header/>
            {workers.length > 0 &&
            <WorkersList states={{groups, setGroups, getWorkersList, selected, setSelected}} data={workers}/>}
            {Boolean(workerGraph) && <HashChart data={workerGraph} since={{since,setSince}}/>}
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
