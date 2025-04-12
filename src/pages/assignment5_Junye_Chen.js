import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import * as d3 from "d3";

import { groupByAirline, groupByAirport } from "../components/utils";
import { AirportMap } from "../components/airportMap";
import { BarChart } from "../components/barChart1";
import styles from '../styles/assignment5_styles.module.css';


const csvUrl = 'https://gist.githubusercontent.com/hogwild/9367e694e12bd2616205e4b3e91285d5/raw/9b451dd6bcc148c3553f550c92096a1a58e1e1e5/airline-routes.csv';
const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';

function useData(csvPath) {
    const [data, setData] = useState(null);
    useEffect(() => {
        d3.csv(csvPath).then(setData);
    }, [csvPath]);
    return data;
}

function useMap(jsonPath) {
    const [map, setMap] = useState(null);
    useEffect(() => {
        d3.json(jsonPath).then(setMap);
    }, [jsonPath]);
    return map;
}

export default function Assignment5Student() {
    const routes = useData(csvUrl);
    const map = useMap(mapUrl);

    const [selectedAirlineID, setSelectedAirlineID] = useState(null);

    if (!routes || !map) {
        return <div>Loading...</div>;
    }

    const airlines = groupByAirline(routes);
    const airports = groupByAirport(routes);

    const chartWidth = 500;
    const chartHeight = 600;
    const mapWidth = 600;
    const mapHeight = 600;

    return (
        <Container fluid style={{ marginTop: "20px" }}>
            <h1 className={styles.h1Style} style={{ textAlign: "center", marginBottom: "30px" }}>
                Airlines and Airports
            </h1>            
            <Row style={{ display: "flex", flexWrap: "nowrap" }}>
                <Col style={{ flex: "0 0 50%" }}>
                    <h3>Airlines</h3>
                    <div style={{ border: "1.5px solid black", padding: "10px", background: "white" }}>
                        <svg width={450} height={400}>
                            <BarChart
                                offsetX={100}
                                offsetY={20}
                                width={350}
                                height={360}
                                data={airlines}
                                selectedAirlineID={selectedAirlineID}
                                setSelectedAirlineID={setSelectedAirlineID}
                                className={styles.svgStyle}
                            />
                        </svg>
                    </div>
                </Col>

                <Col style={{ flex: "0 0 50%" }}>
                    <h3>Airports</h3>
                    <div style={{ border: "1.5px solid black", padding: "10px", background: "white" }}>
                        <svg width={450} height={400}>
                            <AirportMap
                                width={450}
                                height={400}
                                countries={map}
                                airports={airports}
                                routes={routes}
                                selectedAirlineID={selectedAirlineID}
                                className={styles.svgStyle}
                            />
                        </svg>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
