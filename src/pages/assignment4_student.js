import React from 'react';
import * as d3 from "d3";
import 'bootstrap/dist/css/bootstrap.css';

import { Row, Col, Container } from 'react-bootstrap';
import ScatterPlot from '../components/ScatterPlot';
import BarChart from '../components/BarChart';

const csvUrl = '/data/citi_bike_2020.csv';

// Load CSV data
function useData(csvPath) {
    const [dataAll, setData] = React.useState(null);

    React.useEffect(() => {
        d3.csv(csvPath).then(data => {
            data.forEach(d => {
                d.start = +d.start;
                d.tripdurationS = +d.tripdurationS;
                d.end = +d.end;
                d.tripdurationE = +d.tripdurationE;
                d.month = d.month.trim();
                d.station = d.station;
            });
            setData(data);
        });
    }, [csvPath]);

    return dataAll;
}

const Assignment4Student = () => {
    const [month, setMonth] = React.useState('4');

    const dataAll = useData(csvUrl);

    if (!dataAll) {
        return <pre>Loading...</pre>;
    }

    const WIDTH = 600;
    const HEIGHT = 400;
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };
    const innerHeight = HEIGHT - margin.top - margin.bottom;
    const innerWidth = WIDTH - margin.left - margin.right;
    const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Filter data by selected month
    const data = dataAll.filter(d => d.month === MONTH[month]);

    // ScatterPlot scales
    const xScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(dataAll, d => d.tripdurationS)])
        .range([0, innerWidth])
        .nice();

    const yScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(dataAll, d => d.tripdurationE)])
        .range([innerHeight, 0])
        .nice();

    // BarChart scales
    const maxStart = d3.max(dataAll, d => d.start);
    const xScaleBar = d3.scaleBand()
        .domain(data.map(d => d.station))
        .range([0, innerWidth])
        .padding(0.2);

    const yScaleBar = d3.scaleLinear()
        .domain([0, maxStart])
        .range([innerHeight, 0])
        .nice();

    const changeHandler = (event) => {
        const selectedMonth = event.target.value;
        setMonth(selectedMonth);
    };

    return (
        <Container>
            <Row>
                <Col lg={3} md={2}>
                    <input key="slider" type='range' min='0' max='11' value={month} step='1' onChange={changeHandler} />
                    <input key="monthText" type="text" value={MONTH[month]} readOnly />
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <Col>
                    <ScatterPlot
                        svgWidth={WIDTH}
                        svgHeight={HEIGHT}
                        marginLeft={margin.left}
                        marginTop={margin.top}
                        data={data}
                        xScale={xScaleScatter}
                        yScale={yScaleScatter}
                    />
                </Col>
                <Col>
                    <BarChart
                        svgWidth={WIDTH}
                        svgHeight={HEIGHT}
                        marginLeft={margin.left}
                        marginTop={margin.top}
                        data={data}
                        xScale={xScaleBar}
                        yScale={yScaleBar}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Assignment4Student;
