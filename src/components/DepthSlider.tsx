import React from "react";
import { Slider } from "antd";
import type { SliderSingleProps } from "antd";

const style: React.CSSProperties = {
  height: 100,
  marginLeft: 30,
  position: "fixed",
  right: 80,
  top: 30,
};

const marks: SliderSingleProps["marks"] = {
  0: "0m",
  50: "-50m",
  100: "-100m",
};

export const DepthSlider: React.FC<{
  value: number;
  onChange: (v: number) => void;
}> = ({ value, onChange }) => (
  <div style={style}>
    <Slider
      value={value}
      onChange={onChange}
      reverse
      vertical
      marks={marks}
      step={50}
      defaultValue={0}
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
