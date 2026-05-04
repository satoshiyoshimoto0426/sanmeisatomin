/**
 * S/Aランク機能 — 算命学計算エンジン強化
 *
 * 既存の MeishikiResult に加えて、以下を統合した型を定義:
 *  - 立運（節入り日数 ÷ 3 で精密算出）
 *  - 宿命中殺（天中殺・空亡）
 *  - 特殊干支関係（干合・支合・三合・冲・刑・害・破）
 *  - 律音・納音
 *  - 大運天中殺・年運天中殺
 */
import type { MeishikiResult } from './sanmei';
import type { JunName } from './constants';

export type Position = 'year' | 'month' | 'day' | 'time';

export interface DaiunPillar {
  startAge: number;
  endAge: number;
  pillar: string;        // 干支文字列（例: '辛巳'）
  stem: string;
  branch: string;
  followStar: string;    // 十二大従星（日干から見た）
  isTenchuusatsu: boolean;
}

export interface DaiunInfo {
  startAge: number;
  direction: 'forward' | 'backward';
  setsuDistanceDays: number;
  pillars: DaiunPillar[];
}

export interface ChuusatsuLocation {
  position: Position;
  branch: string;
  meaning: string;
  description: string;
}

export interface ChuusatsuInfo {
  tenchuusatsu: [string, string];
  junmei: JunName;
  locations: ChuusatsuLocation[];
}

export interface SpecialRelation {
  type: string;
  positions: Position[];
  elements: string[];
  meaning: string;
}

export interface SpecialRelations {
  kango: SpecialRelation[];
  shigo: SpecialRelation[];
  sanGo: SpecialRelation[];
  chu: SpecialRelation[];
  kei: SpecialRelation[];
  gai: SpecialRelation[];
  ha: SpecialRelation[];
}

export interface RituonMatch {
  pillar: string;
  positions: Position[];
}

export interface NatOnMatch {
  natOnGroup: string;
  pillars: string[];
  positions: Position[];
}

export interface RituonNatOn {
  rituon: RituonMatch[];
  natOn: NatOnMatch[];
}

export interface UnTenchuusatsu {
  daiunPeriods: { startAge: number; endAge: number; pillar: string }[];
  nenunYears: { year: number; pillar: string }[];
}

export interface EnrichedMeishiki extends MeishikiResult {
  /** 性別（立運の方向決定に使用） */
  gender: 'male' | 'female';
  /** 立運情報 */
  daiun: DaiunInfo;
  /** 宿命中殺 */
  chuusatsu: ChuusatsuInfo;
  /** 特殊干支関係 */
  specialRelations: SpecialRelations;
  /** 律音・納音 */
  rituonNatOn: RituonNatOn;
  /** 大運天中殺・年運天中殺 */
  unTenchuusatsu: UnTenchuusatsu;
}
