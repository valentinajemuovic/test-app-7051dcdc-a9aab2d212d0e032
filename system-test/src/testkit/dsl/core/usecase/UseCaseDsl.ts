import type { AppContext, ChannelMode } from '../scenario/app-context.js';
import { UseCaseContext } from '../shared/use-case-context.js';
import { externalSystemModeFromEnv } from '../../../common/env.js';
import { SkyTravelDsl } from './SkyTravelDsl.js';
import { ClockDsl } from './external/clock/ClockDsl.js';
import { ErpDsl } from './external/erp/ErpDsl.js';
import { TaxDsl } from './external/tax/TaxDsl.js';

export class UseCaseDsl {
  private readonly useCaseContext: UseCaseContext;
  private _skyTravelDsl?: SkyTravelDsl;
  private _clockDsl?: ClockDsl;
  private _erpDsl?: ErpDsl;
  private _taxDsl?: TaxDsl;

  constructor(private readonly app: AppContext) {
    this.useCaseContext = new UseCaseContext(externalSystemModeFromEnv());
  }

  skyTravel(mode?: ChannelMode): SkyTravelDsl {
    if (mode) {
      this._skyTravelDsl = new SkyTravelDsl(this.app.skyTravel(mode), this.useCaseContext);
    } else {
      this._skyTravelDsl ??= new SkyTravelDsl(this.app.skyTravel(mode), this.useCaseContext);
    }
    return this._skyTravelDsl;
  }

  clock(): ClockDsl {
    this._clockDsl ??= new ClockDsl(this.app.clockDriver, this.useCaseContext);
    return this._clockDsl;
  }

  erp(): ErpDsl {
    this._erpDsl ??= new ErpDsl(this.app.erpDriver, this.useCaseContext);
    return this._erpDsl;
  }

  tax(): TaxDsl {
    this._taxDsl ??= new TaxDsl(this.app.taxDriver, this.useCaseContext);
    return this._taxDsl;
  }

  async close(): Promise<void> {
    await this.app.closeAll();
  }
}
