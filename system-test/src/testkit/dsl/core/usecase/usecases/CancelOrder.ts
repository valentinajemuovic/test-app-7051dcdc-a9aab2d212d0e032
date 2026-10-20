import type { SkyTravelDriver } from '../../../../driver/port/sky-travel-driver.js';
import type { CancelOrderResponse } from '../../../../driver/port/dtos/CancelOrderResponse.js';
import { UseCaseResult } from '../../shared/use-case-result.js';
import { VoidVerification } from '../../shared/void-verification.js';
import type { UseCaseContext } from '../../shared/use-case-context.js';
import { BaseSkyTravelUseCase } from './base/BaseSkyTravelUseCase.js';

export class CancelOrder extends BaseSkyTravelUseCase<CancelOrderResponse, VoidVerification> {
  private _orderNumberResultAlias = '';

  constructor(driver: SkyTravelDriver, context: UseCaseContext) {
    super(driver, context);
  }

  orderNumber(orderNumberResultAlias: string): this {
    this._orderNumberResultAlias = orderNumberResultAlias;
    return this;
  }

  async execute(): Promise<UseCaseResult<CancelOrderResponse, VoidVerification>> {
    const orderNumber = this.context.getResultValue(this._orderNumberResultAlias) ?? this._orderNumberResultAlias;
    const result = await this.driver.cancelOrder({ orderNumber });

    return new UseCaseResult(
      result,
      this.context,
      (_, ctx) => new VoidVerification(undefined, ctx),
    );
  }
}
