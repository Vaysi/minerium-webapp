import {
    Box,
    Button, ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Container, Pagination,
} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {WorkersGraph} from "../../utils/interfaces";
import {useContext, useEffect, useState} from "react";
import CustomCard from "../inline-components/card";
import {themeModeContext} from "../../utils/context";
import {ArrowLeft, ArrowRight} from "@mui/icons-material";
import moment from "moment";


const useStyles:any = makeStyles((theme:any) => ({
}));


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function format_time(timestamp:number) {
    const dtFormat = new Intl.DateTimeFormat('en-US', {
        timeStyle: 'medium',
        timeZone: 'UTC'
    });

    return dtFormat.format(new Date(timestamp * 1e3));
}

const r = () => {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

interface Props {
    data: WorkersGraph,
    options?: any;
    since: any;
}
const HashChart = (props: Props) => {
    const styles = useStyles();
    const {mode} = useContext(themeModeContext);

    const workersToGraph = (data:Array<any>) => {
      return data.map((item:any) => {
          let color= r();
          //@ts-ignore
          item.label = item.name;
          //@ts-ignore
          item.data = item.rates;
          //@ts-ignore
          item.borderColor = color;
          //@ts-ignore
          item.backgroundColor = color;
          item.lineTension = 0.4;
          return {...item,...{
                  pointBorderColor: r(),
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(4, 49, 128, 0.75)',
                  pointHoverBorderColor: mode == 'light' ? '#043180' : '#fff',
                  pointHoverBorderWidth: 2,
              }};
      });
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },

        scales: {
            y: {
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value:any, index:number, values:any) {
                        return value + ' TH/s';
                    },
                    color: mode == 'dark' ? "#fff" : "#000"
                }
            },
            x: {
                ticks: {
                    color: mode == 'dark' ? "#fff" : "#000"
                }
            }
        },
        maintainAspectRatio: false,
    };

    const [workersData,setWorkersData] = useState(workersToGraph(props.data.workers));

    const [start,setStart] = useState(0);

    const {since,setSince} = props.since;

    useEffect(() => {
        setWorkersData(workersToGraph(props.data.workers));
    },[props.data]);

    const labels = props.data.timestamps.map(item => {
        return format_time(item)
    });

    const data = {
        labels,
        datasets: workersData.slice(start,start+5),
    };

    const nextWorkers = () => {
      setStart(start+5);
    };

    const prevWorkers = () => {
        setStart(start-5);
    };

    const canGoNext = start+5 > workersData.length;

    return (
       <>
           <CustomCard titleProps={{title:"Hashrate Chart"}}>
               <Box display={"flex"} justifyContent={"space-between"}>
                   <Button sx={{textTransform: "none"}} onClick={prevWorkers} disabled={start < 1 } size={"small"} variant="contained" startIcon={<ArrowLeft />}>
                       Prev 5 Workers
                   </Button>
                   <Button sx={{textTransform: "none"}} disabled={canGoNext} onClick={nextWorkers} size={"small"} variant="contained" endIcon={<ArrowRight />}>
                       Next 5 Workers
                   </Button>
               </Box>
               <Box style={{minHeight: "50vh"}}>
                   {
                       //@ts-ignore
                       (<Line options={props.options ?? options} data={data} />)
                   }
               </Box>
               <Box display={"flex"} justifyContent={"center"}>
                   <ButtonGroup sx={{mt:2}} variant="contained" aria-label="outlined primary button group">
                       <Button onClick={() => setSince(since+1)} variant={"outlined"} sx={{textTransform: "none"}}>Previous Day</Button>
                       <Button sx={{textTransform: "none"}}>{moment().subtract(since-1,'d').format("YYYY-MM-DD")}</Button>
                       <Button onClick={() => setSince(since-1)} variant={"outlined"} sx={{textTransform: "none"}} disabled={since == 1}>Next Day</Button>
                   </ButtonGroup>
               </Box>
           </CustomCard>
       </>
    );
}

export default HashChart;
