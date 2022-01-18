import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
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

interface Fake {
    timestamps: Array<number>;
    workers: Array<any>;
}
const graphData:Fake = require('./fake.json');

const useStyles:any = makeStyles((theme:any) => ({
    earnings: {

    },
    card: {

    },
    cardHeader:{
        backgroundColor: "#043180",
        color: "#fff"
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)"
    },
    headerTitle: {

    }
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

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },

    scales: {
        y: {
            ticks: {
                // Include a dollar sign in the ticks
                callback: function(value:any, index:number, values:any) {
                    return value + ' TH/s';
                }
            }
        }
    },
    maintainAspectRatio: false,
};

function format_time(timestamp:number) {
    const dtFormat = new Intl.DateTimeFormat('en-US', {
        timeStyle: 'medium',
        timeZone: 'UTC'
    });

    return dtFormat.format(new Date(timestamp * 1e3));
}


const labels = graphData.timestamps.map(item => {
    return format_time(item)
});

const r = () => {
    return '#'+Math.floor(Math.random()*16777215).toString(16);;
}
const workersData = graphData.workers.map(item => {
    let color= r();
   item.label = item.name;
   item.data = item.rates;
   item.borderColor = color;
   item.backgroundColor = color;
    return {...item,...{
        pointBorderColor: r(),
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(4, 49, 128, 0.75)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
    }};
});
const HashChart = () => {
    const styles = useStyles();
    const data = {
        labels,
        datasets: workersData,
    };

    return (
       <Container maxWidth={"xl"}>
           <Card className={styles.card} sx={{mt:3}}>
               <CardHeader
                   className={styles.cardHeader}
                   title="Hashrate Chart"
                   titleTypographyProps={{
                       style:{
                           fontSize: 17,
                           color: "#fff"
                       }
                   }}
               />
               <CardContent className={styles.cardContent}>
                   <Line options={options} data={data} />
               </CardContent>
           </Card>
       </Container>
    );
}

export default HashChart;
