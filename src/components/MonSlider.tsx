import React from "react";
import { Slider } from "antd";
import type { SliderSingleProps } from "antd";

const style: React.CSSProperties = {
  width: 500,
  position: "fixed",
  right: 180,
  bottom: 30,
};

const marks: SliderSingleProps["marks"] = {
  1: "1月",
  2: "2月",
  3: "3月",
  4: "4月",
  5: "5月",
  6: "6月",
  7: "7月",
  8: "8月",
  9: "9月",
  10: "10月",
  11: "11月",
  12: "12月",
};

export const MonSlider: React.FC<{
  value: number;
  onChange: (v: number) => void;
}> = ({ value, onChange }) => (
  <div style={style}>
    <Slider
      value={value}
      onChange={onChange}
      marks={marks}
      max={12}
      min={1}
      step={1}
      defaultValue={1}
      styles={{
        track: {
          background: "transparent",
        },
        tracks: {
          background: `transparent`,
        },
      }}
    />
  </div>
);
