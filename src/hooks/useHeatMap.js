import { useEffect } from "react";
import useSWRImmutable from "swr/immutable";

const numStops = 10000;
const colorArray = window.chroma
  .scale(["8BB0F0", "FFEB3B", "F44336"])
  .colors(numStops);
const colorScale = window.chroma.scale(colorArray).domain([0, 1]);
colorScale.domain([0, 10000]);

export const acsFetcher = (path) => {
  return new Promise((res, rej) => {
    window.d3.text(path, (data) => {
      if (!data) return rej();
      const scalarField = window.L.ScalarField.fromASCIIGrid(data);
      res(scalarField);
    });
  });
};

export const useHeatMap = (map, depth, month) => {
  const path = `/data/microDataAsc/2018_${depth}m/${depth}m_2018_${month}.asc`;
  const { data } = useSWRImmutable(path, acsFetcher);

  useEffect(() => {
    if (!data || !map) return;

    const scalarHeatmap = window.L.canvasLayer
      .scalarField(data, {
        color: (value) => colorScale(value).brighten(0.1).saturate(0.1).hex(),
        opacity: 0.7,
        interpolate: true,
        inFilter: function (v) {
          return v !== -32767;
        },
      })
      .addTo(map);

    scalarHeatmap.options.className = "dynamic-layer";
  }, [data, map]);
};
