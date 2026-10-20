import type { SkyTravelDriver } from '../../../../driver/port/sky-travel-driver.js';
import type { GoToSkyTravelResponse } from '../../../../driver/port/dtos/GoToSkyTravelResponse.js';
import { UseCaseResult } from '../../shared/use-case-result.js';
import { VoidVerification } from '../../shared/void-verification.js';
import type { UseCaseContext } from '../../shared/use-case-context.js';
import { BaseSkyTravelUseCase } from './base/BaseSkyTravelUseCase.js';

export class GoToSkyTravel extends BaseSkyTravelUseCase<GoToSkyTravelResponse, VoidVerification> {
  constructor(driver: SkyTravelDriver, context: UseCaseContext) {
    super(driver, context);
  }

  async execute(): Promise<UseCaseResult<GoToSkyTravelResponse, VoidVerification>> {
    const result = await this.driver.goToSkyTravel({});

    return new UseCaseResult(
      result,
      this.context,
      (_, ctx) => new VoidVerification(undefined, ctx),
    );
  }
}
