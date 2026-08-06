import { Decimal } from '@prisma/client/runtime/client';

export const toCents = (price: number | Decimal): number =>
  Math.round(Number(price) * 100);

export const centsToDecimal = (cents: number): Decimal =>
  new Decimal(cents).div(100);
