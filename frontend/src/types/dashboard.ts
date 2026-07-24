export type Metric = {
  label: string;
  value: string;
};

export type RankingItem = {
  vehicle: string;
  kilometers: number;
};

export type CategoryVolume = {
  category: string;
  value: number;
};

export type DashboardResponse = {
  totalKilometers: number;
  categoryVolumes: CategoryVolume[];
  vehicleRanking: RankingItem[];
  indicators: Metric[];
};
