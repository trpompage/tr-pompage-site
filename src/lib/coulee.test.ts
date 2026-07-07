import { describe, expect, it } from "vitest";
import {
  fmt,
  formatTemps,
  nbToupies,
  tempsPompageMin,
  volumeChape,
} from "./coulee";

describe("calculateur de coulée", () => {
  it("volume : 120 m² × 50 mm = 6 m³", () => {
    expect(volumeChape(120, 50)).toBeCloseTo(6);
  });

  it("temps : 6 m³ à 20 m³/h = 18 min", () => {
    expect(tempsPompageMin(6)).toBeCloseTo(18);
  });

  it("toupies : minimum 1, arrondi supérieur à 7,5 m³ la toupie", () => {
    expect(nbToupies(6)).toBe(1);
    expect(nbToupies(7.5)).toBe(1);
    expect(nbToupies(7.6)).toBe(2);
    expect(nbToupies(0)).toBe(1);
  });

  it("format fr-FR : virgule décimale", () => {
    expect(fmt(6, 1)).toBe("6,0");
    expect(fmt(112.5, 1)).toBe("112,5");
  });

  it("temps affiché : min sous 1 h, heures décimales au-delà", () => {
    expect(formatTemps(18)).toEqual({ v: "18", u: "min" });
    expect(formatTemps(90)).toEqual({ v: "1,5", u: "h" });
  });
});
