const statusCode1xx = [100, 101, 102, 103] as const;
type StatusCode1xx = (typeof statusCode1xx)[number];
const statusCode2xx = [
  200, 201, 202, 203, 204, 205, 206, 207, 208, 218, 226,
] as const;
type StatusCode2xx = (typeof statusCode2xx)[number];
const statusCode3xx = [300, 301, 302, 303, 304, 306, 307, 308] as const;
type StatusCode3xx = (typeof statusCode3xx)[number];
const statusCode4xx = [
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
  415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 426, 428, 429, 431, 440,
  444, 449, 450, 451, 494, 495, 496, 497, 498, 499,
] as const;
type StatusCode4xx = (typeof statusCode4xx)[number];
const statusCode5xx = [
  500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 520, 521, 522,
  523, 524, 525, 526, 527, 530, 598,
] as const;
type StatusCode5xx = (typeof statusCode4xx)[number];
const allStatusCodes = [
  ...statusCode1xx,
  ...statusCode2xx,
  ...statusCode3xx,
  ...statusCode4xx,
  ...statusCode5xx,
];
export type AllStatusCodes = (typeof allStatusCodes)[number];

function isValidStatusCode(maybeStatus: number): maybeStatus is AllStatusCodes {
  return allStatusCodes.includes(maybeStatus as any);
}

export class StatusCode<const Status extends AllStatusCodes = AllStatusCodes> {
  static OK = StatusCode.of(200);
  protected constructor(public value: Status) {}

  is1xx(): this is StatusCode<StatusCode1xx> {
    return statusCode1xx.includes(this.value as any);
  }

  is100(): this is StatusCode<100> {
    return this.value === 100;
  }

  is101(): this is StatusCode<101> {
    return this.value === 101;
  }

  is102(): this is StatusCode<102> {
    return this.value === 102;
  }

  is103(): this is StatusCode<103> {
    return this.value === 103;
  }

  is2xx(): this is StatusCode<StatusCode2xx> {
    return this.value < 300 && this.value > 199;
  }

  is200(): this is StatusCode<200> {
    return this.value === 200;
  }

  is201(): this is StatusCode<201> {
    return this.value === 201;
  }

  is202(): this is StatusCode<202> {
    return this.value === 202;
  }

  is203(): this is StatusCode<203> {
    return this.value === 203;
  }

  is204(): this is StatusCode<204> {
    return this.value === 204;
  }

  is205(): this is StatusCode<205> {
    return this.value === 205;
  }

  is206(): this is StatusCode<206> {
    return this.value === 206;
  }

  is207(): this is StatusCode<207> {
    return this.value === 207;
  }

  is208(): this is StatusCode<208> {
    return this.value === 208;
  }

  is218(): this is StatusCode<218> {
    return this.value === 218;
  }

  is226(): this is StatusCode<226> {
    return this.value === 226;
  }

  is3xx(): this is StatusCode<StatusCode3xx> {
    return this.value < 400 && this.value > 299;
  }

  is300(): this is StatusCode<300> {
    return this.value === 300;
  }

  is301(): this is StatusCode<301> {
    return this.value === 301;
  }

  is302(): this is StatusCode<302> {
    return this.value === 302;
  }

  is303(): this is StatusCode<303> {
    return this.value === 303;
  }

  is304(): this is StatusCode<304> {
    return this.value === 304;
  }

  is306(): this is StatusCode<306> {
    return this.value === 306;
  }

  is307(): this is StatusCode<307> {
    return this.value === 307;
  }

  is308(): this is StatusCode<308> {
    return this.value === 308;
  }

  is4xx(): this is StatusCode<StatusCode4xx> {
    return this.value < 500 && this.value > 399;
  }

  is400(): this is StatusCode<400> {
    return this.value === 400;
  }

  is401(): this is StatusCode<401> {
    return this.value === 401;
  }

  is402(): this is StatusCode<402> {
    return this.value === 402;
  }

  is403(): this is StatusCode<403> {
    return this.value === 403;
  }

  is404(): this is StatusCode<404> {
    return this.value === 404;
  }

  is405(): this is StatusCode<405> {
    return this.value === 405;
  }

  is406(): this is StatusCode<406> {
    return this.value === 406;
  }

  is407(): this is StatusCode<407> {
    return this.value === 407;
  }

  is408(): this is StatusCode<408> {
    return this.value === 408;
  }

  is409(): this is StatusCode<409> {
    return this.value === 409;
  }

  is410(): this is StatusCode<410> {
    return this.value === 410;
  }

  is411(): this is StatusCode<411> {
    return this.value === 411;
  }

  is412(): this is StatusCode<412> {
    return this.value === 412;
  }

  is413(): this is StatusCode<413> {
    return this.value === 413;
  }

  is414(): this is StatusCode<414> {
    return this.value === 414;
  }

  is415(): this is StatusCode<415> {
    return this.value === 415;
  }

  is416(): this is StatusCode<416> {
    return this.value === 416;
  }

  is417(): this is StatusCode<417> {
    return this.value === 417;
  }

  is418(): this is StatusCode<418> {
    return this.value === 418;
  }

  is419(): this is StatusCode<419> {
    return this.value === 419;
  }

  is420(): this is StatusCode<420> {
    return this.value === 420;
  }

  is421(): this is StatusCode<421> {
    return this.value === 421;
  }

  is422(): this is StatusCode<422> {
    return this.value === 422;
  }

  is423(): this is StatusCode<423> {
    return this.value === 423;
  }

  is424(): this is StatusCode<424> {
    return this.value === 424;
  }

  is426(): this is StatusCode<426> {
    return this.value === 426;
  }

  is428(): this is StatusCode<428> {
    return this.value === 428;
  }

  is429(): this is StatusCode<429> {
    return this.value === 429;
  }

  is431(): this is StatusCode<431> {
    return this.value === 431;
  }

  is440(): this is StatusCode<440> {
    return this.value === 440;
  }

  is444(): this is StatusCode<444> {
    return this.value === 444;
  }

  is449(): this is StatusCode<449> {
    return this.value === 449;
  }

  is450(): this is StatusCode<450> {
    return this.value === 450;
  }

  is451(): this is StatusCode<451> {
    return this.value === 451;
  }

  is494(): this is StatusCode<494> {
    return this.value === 494;
  }

  is495(): this is StatusCode<495> {
    return this.value === 495;
  }

  is496(): this is StatusCode<496> {
    return this.value === 496;
  }

  is497(): this is StatusCode<497> {
    return this.value === 497;
  }

  is498(): this is StatusCode<498> {
    return this.value === 498;
  }

  is499(): this is StatusCode<499> {
    return this.value === 499;
  }

  is5xx(): this is StatusCode<StatusCode5xx> {
    return this.value < 600 && this.value > 499;
  }

  is500(): this is StatusCode<500> {
    return this.value === 500;
  }

  is501(): this is StatusCode<501> {
    return this.value === 501;
  }

  is502(): this is StatusCode<502> {
    return this.value === 502;
  }

  is503(): this is StatusCode<503> {
    return this.value === 503;
  }

  is504(): this is StatusCode<504> {
    return this.value === 504;
  }

  is505(): this is StatusCode<505> {
    return this.value === 505;
  }

  is506(): this is StatusCode<506> {
    return this.value === 506;
  }

  is507(): this is StatusCode<507> {
    return this.value === 507;
  }

  is508(): this is StatusCode<508> {
    return this.value === 508;
  }

  is509(): this is StatusCode<509> {
    return this.value === 509;
  }

  is510(): this is StatusCode<510> {
    return this.value === 510;
  }

  is511(): this is StatusCode<511> {
    return this.value === 511;
  }

  is520(): this is StatusCode<520> {
    return this.value === 520;
  }

  is521(): this is StatusCode<521> {
    return this.value === 521;
  }

  is522(): this is StatusCode<522> {
    return this.value === 522;
  }

  is523(): this is StatusCode<523> {
    return this.value === 523;
  }

  is524(): this is StatusCode<524> {
    return this.value === 524;
  }

  is525(): this is StatusCode<525> {
    return this.value === 525;
  }

  is526(): this is StatusCode<526> {
    return this.value === 526;
  }

  is527(): this is StatusCode<527> {
    return this.value === 527;
  }

  is530(): this is StatusCode<530> {
    return this.value === 530;
  }

  is598(): this is StatusCode<598> {
    return this.value === 598;
  }

  static of<const Status extends AllStatusCodes>(status: Status) {
    return new StatusCode(status);
  }

  static from<const Status extends number>(maybeStatus: Status) {
    if (!isValidStatusCode(maybeStatus)) {
      throw new Error(`${maybeStatus} is not a valid statusCode`);
    }
    return new StatusCode(maybeStatus);
  }
}
