export interface MetricModel {
    subsidiary: number;
    devices: Tab[];
    accessories: Tab[];
    homes: Tab[];
    images: Tab[];
}

export interface Subsidiary {
    toLowerCase(): unknown;
    id : number;
    name: string;
    internal_id: number;
    segment: number;
}

export interface Item {
    element: number,  
    item_type_code: string,
    display_on: boolean,
    cause_off: null
}

export interface Tab {
    place_id: number;
    custom_score: number;
    images: string[];
    items: Item[];
}

