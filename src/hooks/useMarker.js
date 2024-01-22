import { useEffect } from "react";

export const useMarker = (map, position, onPositionChange) => {
  useEffect(() => {
    if (map) {
      const maker = window.L.marker([position.lat, position.lng]).addTo(map);

      map.addEventListener("click", (e) => {
        maker.setLatLng(e.latlng);
        onPositionChange(e.latlng)
      });
    }
  }, [map, onPositionChange, position.lat, position.lng]);
};
