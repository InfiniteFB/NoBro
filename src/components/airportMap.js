import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import { Routes } from './routes';

function AirportMap(props){
    const {width, height, countries, airports, routes, selectedAirlineID} = props;

    // Define a projection of Mercator
    const projection = geoMercator()
        .scale(97)
        .translate([width / 2, height / 2 + 20]);

    // Define a path generator using the projection
    const pathGenerator = geoPath().projection(projection);

    return (
        <g>
            {/* Plot the world map */}
            {countries.features.map((feature, index) => (
                <path
                    key={index}
                    d={pathGenerator(feature)}
                    fill="#eee"
                    stroke="#ccc"
                />
            ))}

            {/* Plot the airports */}
            {airports.map((airport, index) => {
                const [x, y] = projection([+airport.Longitude, +airport.Latitude]);
                return (
                    <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={1}
                        fill="#2a5599"
                    />
                );
            })}

            {/* Plot the routes */}
            <Routes projection={projection} routes={routes} selectedAirlineID={selectedAirlineID}/>
        </g>
    );
}

export { AirportMap };
