import React from "react";
import { geoPath } from "d3";

function Routes(props) {
    const { projection, routes, selectedAirlineID } = props;

    if (!selectedAirlineID) {
        return <g></g>;
    }

    const pathGenerator = geoPath().projection(projection);

    const selectedRoutes = routes.filter(d => d.AirlineID === selectedAirlineID);

    return (
        <g>
            {selectedRoutes.map((d, i) => {
                const source = [d.SourceLongitude, d.SourceLatitude];
                const target = [d.DestLongitude, d.DestLatitude];

                const pathData = {
                    type: "LineString",
                    coordinates: [source, target],
                };

                return (
                    <path
                        key={i}
                        d={pathGenerator(pathData)}
                        stroke="#992a5b"
                        strokeWidth={0.5}
                        fill="none"
                        opacity={0.7}
                    />
                );
            })}
        </g>
    );
}

export { Routes };
