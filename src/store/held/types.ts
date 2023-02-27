export const ADD_HELD = 'ADD_HELD';
export const REMOVE_HELD = 'REMOVE_HELD';
export const SET_HELDEN = 'SET_HELDEN';
export const SELECT_HELD = 'SELECT_HELD';
export const DESELECT_HELD = 'DESELECT_HELD';
export const SET_HELD_STATE = 'SET_HELD_STATE';

export type THeldState = 'new' | 'active' | 'inactive'

interface IActionAddHeld {
    type: typeof ADD_HELD;
    payload: IHeld;
}

interface IActionRemoveHeld {
    type: typeof REMOVE_HELD;
    payload: string;
}

interface IActionSetHeldState {
    type: typeof SET_HELD_STATE;
    payload: {
        id: string;
        state: THeldState;
    }
}

interface IActionSetHelden {
    type: typeof SET_HELDEN;
    payload: IHeld[];
}

export type TActionHeld =
    | IActionAddHeld
    | IActionRemoveHeld
    | IActionSetHelden
    | IActionSetHeldState;

export interface IMeta {
    state: THeldState;
    attrBase: IAttrBase;
    attrExt: IAttrExt;
}

export interface IAttrBase {
    MU: IMetaAttr;
    KL: IMetaAttr;
    IN: IMetaAttr;
    CH: IMetaAttr;
    FF: IMetaAttr;
    GE: IMetaAttr;
    KO: IMetaAttr;
    KK: IMetaAttr;
    SO: IMetaAttr;
}

export interface IAttrExt {
    MR: IMetaAttr;
    LE: IMetaAttr;
    AU: IMetaAttr;
    AE: IMetaAttr;
    KE: IMetaAttr;
}

export interface IMetaAttr {
    value: number;
    mod: number;
    base: IEigenschaft;
}

export interface IHeld extends INameField {
    '@_key': string;
    '@_stand': string;
    mods: string;
    meta: IMeta;
    basis: IBasis;
    eigenschaften: {
        eigenschaft: IEigenschaft[];
    };
    vt: {
        vorteil: IVorteil[];
    };
    sf: {
        sonderfertigkeit: ISonderfertigkeit[];
    };
    ereignisse: {
        ereignis: any[];
    };
    talentliste: {
        talent: ITalent[];
    };
    zauberliste: {
        zauber: IZauber[];
    };
    kampf: {
        kampfwerte: IKampfwerte[];
    };
    gegenstände: string;
    BoniWaffenlos: string;
    kommentare: {
        sfInfos: {
            '@_dauer': string;
            '@_kosten': string;
            '@_probe': string;
            '@_sf': string;
            '@_sfname': string;
            '@_wirkung': string;
        };
    };
    ausrüstungen: {
        heldenausruestung: {
            '@_name': string;
            '@_nummer': string;
            '@_set': string;
        };
    };
    verbindungen: string;
    extention: string;
    geldboerse: string;
    plugindata: string;
}

interface IValueField {
    '@_value': string;
}

interface INameField {
    '@_name': string;
}

interface IKField {
    '@_k': string;
}

interface IProbe extends INameField, IValueField {
    '@_lernmethode': string;
    '@_probe': string;
}

interface INameFieldHumanReadable extends INameField{
    '@_string': string;
}

interface IBasis {
    geschlecht: INameField;
    settings: ISettings;
    rasse: IRasse;
    kulture: INameFieldHumanReadable;
    ausbildungen: {
        ausbildung: IAusbildung;
    };
    verify: IValueField;
    notitz: {
        '@_notitz0': string;
        '@_notitz1': string;
        '@_notitz2': string;
        '@_notitz3': string;
        '@_notitz4': string;
        '@_notitz5': string;
        '@_notitz6': string;
        '@_notitz7': string;
        '@_notitz8': string;
        '@_notitz9': string;
        '@_notitz10': string;
        '@_notitz11': string;
    };
    prtraet: IValueField;
    abenteuerpunkte: IValueField;
    freieabenteuerpunkte: IValueField;
    gilde: INameField;
}

export interface IEigenschaft extends IValueField, INameField {
    '@_mod': string;
    '@_startwert'?: string;
    '@_grossemeditation'?: string;
    '@_mrmod'?: string;
    '@_karmalqueste'?: string;
}

interface IVorteil extends INameField, Partial<IValueField> {
    auswahl?: {
        '@_position': string;
        '@_value': string;
    }[];
}

interface ISonderfertigkeit extends INameField {
    kultur?: INameField;
    zauber?: IZauberSpez;
    spezialisierung?: INameField;
}

interface IZauberSpez extends INameField {
    '@_repraesentation': string;
    '@_variante': string;
}

export interface ITalent extends IProbe, Partial<IKField> {
    '@_be'?: string;
}

interface IZauber extends IZauberSpez, IProbe, IKField {
    '@_anmerkungen': string;
    '@_hauszauber': string;
    '@_kosten': string;
    '@_reichweite': string;
    '@_wirkunsdauer': string;
    '@_zauberdauer': string;
    '@_zauberkommentar': string;
}

interface IKampfwerte extends INameField {
    attacke: IValueField;
    parade: IValueField;
}

interface ISettings extends INameField {
    inc: INameField[];
}

interface IRasse extends INameFieldHumanReadable {
    groesse: {
        '@_gewicht': string;
        '@_value': string;
    };
    aussehen: {
        '@_alter': string;
        '@_augenfarbe': string;
        '@_aussehentext0': string;
        '@_aussehentext1': string;
        '@_aussehentext2': string;
        '@_aussehentext3': string;
        '@_familietext0': string;
        '@_familietext1': string;
        '@_familietext2': string;
        '@_familietext3': string;
        '@_familietext4': string;
        '@_familietext5': string;
        '@_gebjahr': string;
        '@_gebmonat': string;
        '@_gebtag': string;
        '@_gprest': string;
        '@_gpstart': string;
        '@_haarfarbe': string;
        '@_kalender': string;
        '@_stand': string;
        '@_titel': string;
    };
}

interface IAusbildung extends INameFieldHumanReadable {
    variante: INameField;
    '@_art': string;
    '@_tarnidentitaet': string;
}
