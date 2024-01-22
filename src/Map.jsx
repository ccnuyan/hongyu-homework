import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useMarker } from "./hooks/useMarker";
import { useHeatMap, acsFetcher } from "./hooks/useHeatMap";
import { DepthSlider } from "./components/DepthSlider";
import { MonSlider } from "./components/MonSlider";
import { Typography } from "antd";
import useSWRImmutable from "swr/immutable";

export const initialState = { lat: 20, lng: 120, zoom: 5 };

const { Title, Paragraph } = Typography;

export const Map = () => {
  let mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [depth, setDepth] = useState(0);
  const [month, setMon] = useState(1);
  const [position, setPosition] = useState({
    lat: initialState.lat,
    lng: initialState.lng,
  });

  const path = `/data/microDataAsc/2018_${depth}m/${depth}m_2018_${month}.asc`;
  const { data } = useSWRImmutable(path, acsFetcher);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = window.L.map(mapContainerRef.current).setView(
      [initialState.lat, initialState.lng],
      initialState.zoom
    );

    map.createPane("labels");

    window.L.tileLayer("/data/mapTile/{z}/{x}/{y}.png", {
      maxZoom: 6,
      pane: "labels",
    }).addTo(map);

    window.L.tileLayer("/data/labelTile/{z}/{x}/{y}.png", {
      maxZoom: 6,
      pane: "labels",
    }).addTo(map);
    setMap(map);
  }, []);

  const roundToZeroPointFivePosition = useMemo(() => {
    return {
      lat: Math.round(position.lat * 2) / 2,
      lng: Math.round(position.lng * 2) / 2,
    };
  }, [position]);
  useMarker(map, position, setPosition);
  useHeatMap(map, depth, month);

  const valueAtPosition = useMemo(() => {
    if (!data) return "";

    if (position.lat > data.yurCorner) return "";
    if (position.lat < data.yllCorner) return "";
    if (position.lng > data.xurCorner) return "";
    if (position.lng < data.xllCorner) return "";

    const { lat, lng } = roundToZeroPointFivePosition;
    console.log(lat, lng, data);
    let col = (lng - data.xllCorner) / data.cellXSize;
    let row = (data.yurCorner - lat) / data.cellYSize;

    col = Math.max(0, Math.min(data.nCols - 1, col));
    row = Math.max(0, Math.min(data.nRows - 1, row));

    return data.grid[row][col];
  }, [data, position.lat, position.lng, roundToZeroPointFivePosition]);

  return (
    <>
      <div
        className="map-container"
        style={{
          position: "fixed",
          height: "100%",
          width: "100%",
          background: "rgba(160, 210, 255, 0.5)",
        }}
        ref={mapContainerRef}
      ></div>
      <DepthSlider value={depth} onChange={setDepth} />
      <MonSlider value={month} onChange={setMon} />
      <Title
        style={{ marginLeft: 80, zIndex: 500, position: "fixed" }}
        level={3}
      >
        2018 年 1～12 月中国沿海浮游生物分布热点图
      </Title>
      <Title
        level={4}
        style={{ marginLeft: 80, zIndex: 500, position: "fixed", bottom: 60 }}
      >
        <p>{`月份：${month}月, 深度：${depth === 0 ? "" : "-"}${depth}米`}</p>
        <p>{`lat: ${roundToZeroPointFivePosition.lat}, lng: ${roundToZeroPointFivePosition.lng}`}</p>
        {`浮游生物密度: ${valueAtPosition}`}
      </Title>
    </>
  );
};
