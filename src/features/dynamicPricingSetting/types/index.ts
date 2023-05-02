import type { IOccupancyBasedTriggerRule } from "features/occupancyRules/types";
import type { ITimeBasedTriggerRule } from "features/timeRules/types";

export interface IDynamicPricingSetting {
  readonly uuid: string;
  isEnabled: boolean;
  isOccupancyBased: boolean;
  occupancyBasedTriggerRules: IOccupancyBasedTriggerRule[];
  isTimeBased: boolean;
  timeBasedTriggerRules: ITimeBasedTriggerRule[];
  readonly createdAt: string;
  readonly updatedAt: string;
};
