export type PartCategory =
  | 'CPU'
  | 'Motherboard'
  | 'RAM'
  | 'GPU'
  | 'Storage'
  | 'PSU'
  | 'Case'
  | 'CPU Cooler';

export type RamType = 'DDR4' | 'DDR5';
export type CoolerType = 'Air' | 'AIO Liquid';
export type CaseFormFactor = 'Mid Tower' | 'Micro ATX';

export interface PartBase {
  id: string;
  name: string;
  price: number;
  category: PartCategory;
  incompatibleWith: string[];
  image: string;
  description: string;
}

export interface CpuPart extends PartBase {
  category: 'CPU';
  socket: string;
}

export interface MotherboardPart extends PartBase {
  category: 'Motherboard';
  socket: string;
}

export interface RamPart extends PartBase {
  category: 'RAM';
  type: RamType;
}

export interface GpuPart extends PartBase {
  category: 'GPU';
}

export interface StoragePart extends PartBase {
  category: 'Storage';
}

export interface PsuPart extends PartBase {
  category: 'PSU';
  wattage: number;
}

export interface CasePart extends PartBase {
  category: 'Case';
  formFactor: CaseFormFactor;
}

export interface CpuCoolerPart extends PartBase {
  category: 'CPU Cooler';
  type: CoolerType;
}

export type Part =
  | CpuPart
  | MotherboardPart
  | RamPart
  | GpuPart
  | StoragePart
  | PsuPart
  | CasePart
  | CpuCoolerPart;

/** Maps part category to the selected part id */
export type BuildSelections = Partial<Record<PartCategory, string>>;

export interface SavedBuild {
  id: string;
  name: string;
  selections: BuildSelections;
  totalCost: number;
  createdAt: string;
}

export interface Draft {
  id: string;
  selections: BuildSelections;
  totalCost: number;
  updatedAt: string;
}

export interface SaveBuildPayload {
  name: string;
  selections: BuildSelections;
  totalCost: number;
}

export interface SaveDraftPayload {
  selections: BuildSelections;
  totalCost: number;
}

export interface Database {
  parts: Part[];
  builds: SavedBuild[];
  drafts: Draft[];
}
