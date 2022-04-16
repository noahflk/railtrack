export type Pass = {
  station_coordinate_x: number;
  station_coordinate_y: number;
};

export type Section = {
  passes: Pass[];
};

export type Journey = {
  sections: Section[];
};
