import type { SkyTravelDriver } from '../../../../../driver/port/sky-travel-driver.js';
import { BaseUseCase } from '../../../shared/base-use-case.js';

export abstract class BaseSkyTravelUseCase<TResponse, TVerification> extends BaseUseCase<
  SkyTravelDriver,
  TResponse,
  TVerification
> {}
