export class Catalogue {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    version: number;
    name: string;
    image: string;
    commercial_terms: string;
    warranty_policy: string;
    warranty_policy_2: string;
    segment: number;
    homes: number[];
    group_plan: number[];
}

export class CatalogueObject {
    id: number;
    name: string;
}

export class Trade {
    id: number;
    name: string = '';
    logo: string = '';
    subsidiaries?: [];
}

export class ItemType {
    id: number;
    name: string;
}

export class InputType {
    id: number;
    type: string;
    name: string;
    is_active: boolean;
}

export class Input {
    id: number;
    input_type: InputType;
    created: Date;
    modified: Date;
    is_removed: boolean;
    code: string;
    default_value: string;
    is_active: boolean;
    template: number;

    /* public objectExport(inputs: Input[]): any[]{
        let inputs_: any[] = [];
        for (let item of inputs){
            if(item.input_type.type != 'product'){
                let _object = {
                    'code' : (item.code) ? item.code : '',
                    'value' : (item.default_value) ? item.default_value : ''
                }
                inputs_.push(_object);
            }
        }
        return inputs_;
    } */
}

export class Template {
    id: number;
    inputs: Input[];
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    description: string;
    css: string;
    html: string;
    is_active: boolean;
}

export class Metadata {
    name: string;
    size: number;
    lastModified: any;
    type: any;
}

export class Video {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    video_url: string;
    metadata: Metadata;
    is_active: boolean;
}

export class ProductType {
    id: number;
    created: Date;
    modified: Date;
    name: string;
}

export class Color {
    id: number;
    name: string;
    color: string;
    equipment: number;
}

export class MainImageResolutions {
}

export class Provider {
    id: number;
    name: string;
    logo: string;
    icon_extra1: string;
    icon_extra2: string;
    icon_extra3?: any;
}

export class Sticker {
    id: number;
    name: string;
    image: string;
}

export class TypePrice {
    id: number;
    name: string;
}

export class Plan {
    id: number;
    sale_price: string;
    customer_price: string;
    price_1: string;
    price_2: string;
    type_price: TypePrice;
    min_payment: string;
    fee_amount: string;
    plan_id: number;
    plan_name: string;
    image: string;
    created: Date;
    modified: Date;
    is_removed: boolean;
    start: Date;
    end?: any;
    cuote_number: number;
    equipment_detail: number;
}

export class AccessoryDetail {
    id: number;
    sale_price: string;
    customer_price: string;
    price_1: string;
    price_2: string;
    type_price: TypePrice;
    accessory_image: string;
    accessory_name: string;
    provider_name: string;
    promotion_object?: any;
    created: Date;
    modified: Date;
    is_removed: boolean;
    internal_id: string;
    ref_id: string;
    url: string;
    is_active: boolean;
    start: Date;
    color: string;
    color_text: string;
    organization: number;
    accessory: number;
    catalogue: number;
    promotion?: any;
}

export class ImageResolutions {
}

export class SocialMedia {
    id: number;
    image_resolutions: ImageResolutions;
    name: string;
    image: string;
}

export class EquipmentPlan {
    id: number;
    sale_price: string;
    customer_price: string;
    price_1: string;
    price_2: string;
    type_price: TypePrice;
    min_payment: string;
    fee_amount: string;
    plan_id: number;
    plan_name: string;
    image: string;
    created: Date;
    modified: Date;
    is_removed: boolean;
    start: Date;
    end?: any;
    cuote_number?: any;
    equipment_detail: number;
}

export class Adscreen {
    id: number;
    equipment_detail: number;
    accessory_details: AccessoryDetail[];
    plans: Plan[];
    plan: Plan[];
    equipment_plan: EquipmentPlan[];
    program: boolean;
    blue: boolean;
}

export class File {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    file: string;
    organization: number;
}

export class PlaylistConfiguration {
    id: number;
    created: Date;
    modified: Date;
    playlist: number;
    configuration: number;
    playlist_type: number;
}

export class Item2 {
    id: number;
    file: File;
    media_type: string;
    created: Date;
    modified: Date;
    name: string;
    order: number;
    description: string;
    playlist: number;
}

export class EquipmentDetail {
    id: number;
    sale_price: string;
    customer_price: string;
    price_1: string;
    price_2: string;
    type_price: TypePrice;
    program: any[];
    promotion?: any;
    plans: Plan[];
    adscreen: Adscreen[];
    playlist: [];
    created: Date;
    modified: Date;
    is_removed: boolean;
    start: Date;
    end?: any;
    internal_id: string;
    ref_id: string;
    url: string;
    memory: number;
    is_active: boolean;
    color: string;
    color_text: string;
    background_color: string;
    organization: number;
    equipment: number;
    catalogue: number;
}

export class Feature {
    id: number;
    file: File;
    description: string;
    equipment: number;
}

export class Equipment {
    id: number;
    images: any[];
    product_type: ProductType;
    colors: Color[];
    main_image_resolutions: MainImageResolutions;
    provider: Provider;
    sticker: Sticker;
    equipment_details: EquipmentDetail[];
    related_products: any[];
    in_promotion: boolean;
    features: Feature[];
    background_color?: any;
    grid_size: number;
    grid_orientation: string;
    grid_animation: boolean;
    grid_image: string;
    grid_tone: boolean;
    name: string;
    is_active: boolean;
    main_image: string;
    second_image?: any;
    description: string;
    created: Date;
    modified: Date;
    processor: string;
    screen: string;
    frontal_camera: string;
    rear_camera: string;
    network: string;
    polymorphic_ctype: number;
}


export class Line {
}

export class Accessory {
    id: number;
    sale_price: string;
    customer_price: string;
    price_1: string;
    price_2: string;
    type_price?: any;
    product_type: ProductType;
    line: Line;
    provider: Provider;
    subcategory: Subcategory;
    main_image_resolutions: MainImageResolutions;
    accessory_details: AccessoryDetail[];
    equipments: any[];
    in_promotion: boolean;
    background_color?: any;
    grid_size: number;
    grid_orientation?: any;
    grid_animation: boolean;
    grid_image?: any;
    grid_tone: boolean;
    name: string;
    is_active: boolean;
    main_image: string;
    second_image?: any;
    description: string;
    created: Date;
    modified: Date;
    code: string;
    image_size: number;
    polymorphic_ctype: number;
    promotion?: any;
}

export class Category {
    id: number;
    created: Date;
    modified: Date;
    name: string;
}

export class Subcategory {
    id: number;
    category: Category;
    created: Date;
    modified: Date;
    name: string;
}

export class Values {
    url: string;
    name: string;
    size: string;
    type: string;
    id_video?: number;
    lastModified?: Date;
}

export class Inputs {
    values: Input[] = [];
}

export class Item {
    id: number;
    item_type: ItemType;
    template: Template;
    video: Video;
    equipment: Equipment;
    accessory: Accessory;
    equipment_detail: number;
    accessory_detail: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    interval?: number;
    values: Inputs;
    order: number;
    is_active: any;
    playlist: number;
    memory: number;
    is_valid: boolean = true;

    constructor(){
        this.is_valid = true;
    }

    public objectExport(): ItemExport{

        let _object: ItemExport = {
            id : (this.id) ? this.id : null,
            item_type : (this.item_type) ? this.item_type.id : null,
            template : (this.template) ? this.template.id : null,
            video : (this.video) ? this.video.id : null,
            name : (this.name) ? this.name : '',
            interval : (this.interval) ? this.interval : 20,
            values : (this.values) ? this.values : new Inputs,
            order : (this.order) ? this.order : 1,
            is_active : (this.is_active) ? "1" : "0",
            is_removed : (this.is_removed) ? "1" : "0",
            playlist : (this.playlist) ? this.playlist : null,
            memory : (this.memory) ? this.memory : 0,
            equipment_detail : (this.equipment_detail) ? this.equipment_detail : null,
            accessory_detail : (this.accessory_detail) ? this.accessory_detail : null
        }
        return _object
    }
}

export class ItemExport {
    id: number;
    item_type: number;
    template: number;
    video: number;
    equipment_detail: any;
    accessory_detail: any;
    name: string;
    interval: number;
    values: any;
    order: number;
    is_active: string;
    is_removed: string;
    playlist: number;
    memory: number
}

export class Playlist {
    id: number;
    items: Item[];
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    start_date: any;
    end_date: any;
    catalogue: number;
    application: number;
    is_active: boolean;
}

export class Application {
    id: number;
    name: string;
}


export class Playlist2 {
    id: number;
    items: Item[];
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    start_date: any;
    end_date: any;
    catalogue: CatalogueObject;
    application: Application;
    is_active: boolean;

    constructor(){
    }

    public objectExport(): any{
        let _object = {
            id: this.id,
            name: this.name,
            start_date: this.start_date,
            end_date: this.end_date,
            catalogue : (this.catalogue) ? this.catalogue.id : null,
            application : (this.application) ? this.application : null,
        }
        return _object
    }
    

}


export class DeviceType {
    id: number;
    name: string;
    format: string;
    prefix: string;
    is_visual: boolean;
}

export class Detail {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    internal_code: string;
    serial: string;
    is_connected: boolean;
    ip_address: string;
    mac_address: string;
    content?: any;
    thumbnail?: any;
    online: boolean;
    battery: string;
    screenshot: string;
    power_status: string;
}

export class Segment {
    id: number;
    name: string;
    description?: any;
    is_active: boolean;
    trade: number;
    subsidiary: number[];
}

export class SubsidiaryRelation {
    id: number;
    segment: Segment;
    created: Date;
    modified: Date;
    is_removed: boolean;
    internal_id: number;
    region_old: string;
    city: string;
    address: string;
    commune: string;
    phone_number?: any;
    name: string;
    contact?: any;
    contact_email?: any;
    code?: any;
    region: number;
    channel: number;
    sales_channel?: any;
    segmentation: number;
    zone: number;
    organization: number;
}

export class Configuration {
    id: number;
    created: Date;
    modified: Date;
    name: string;
    subdomain: string;
    configuration: number;
    segment: number;
    theme: number;
}

export class Device {
    id: number;
    image?: any;
    child_devices: any[];
    format?: any;
    device_type: DeviceType;
    model?: any;
    detail: Detail;
    subsidiary_relation: SubsidiaryRelation;
    configuration: Configuration[];
    created: Date;
    modified: Date;
    is_removed: boolean;
    device_name: string;
    internal_code: string;
    serial: string;
    parent_devices?: any;
    subsidiary: number;
}

export class Group {
    id: number;
    name: string;
}

export class User {
    id: number;
    first_name: string;
    last_name: string;
    rut?: any;
    check_digit?: any;
    is_active: boolean;
    groups: Group[];
}

export class Channel {
    id: number;
    organization: number;
    user: number;
    channel: number[];
    subsidiaries: number[];
}

export class Subsidiary {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    internal_id: number;
    region_old: string;
    city: string;
    address: string;
    commune: string;
    phone_number?: any;
    name: string;
    contact?: any;
    contact_email?: any;
    code?: any;
    region: number;
    channel: number;
    segmentation: number;
    zone: number;
    organization: number;
}

export class UserChannel {
    user: User;
    channel: Channel;
    subsidiaries: Subsidiary[];
}


export interface RankingDevice {
    position: any[];
    brand: string;
    model: string;
    interactions_1: number;
    interactions_2: number;
    interactions_3: number;
    segment: string;
}

/** modelos detalle */
export class Orientation {
    id: number;
    created: Date;
    modified: Date;
    name: string;
}

export class Format {
    id: number;
    orientation: Orientation;
    column: number;
    row: number;
}

export class Model {
    id: number;
    created: Date;
    modified: Date;
    is_removed: boolean;
    name: string;
    brand: number;
}

export class App {
    versionName: string;
    name: string;
    package_name: string;
    versionCode: number;
    blocked: boolean;
}


export class Hardware {
    availableExternalMemorySize: string;
    availableInternalMemorySize: string;
    externalMemorySize: string;
    freeRamSize: string;
    internalMemorySize: string;
    ramSize: string;
}


export class ContextData {
    app: App;
    device: Device;
    hardware: Hardware;
    videos: Video[];
}


export class Info {
    is_removed: boolean;
    info?: any;
}


export class Position {
    id: number;
    image?: any;
    child_devices: any[];
    format: Format;
    device_type: DeviceType;
    model: Model;
    detail: Detail;
    info: Info;
    subsidiary_relation: SubsidiaryRelation;
    configuration: Configuration[];
    created: Date;
    modified: Date;
    is_removed: boolean;
    device_name: string;
    internal_code: string;
    serial: string;
    parent_devices?: any;
    subsidiary: number;
}

export class DeviceElastic {
    position: Position;
    brand: string;
    model: string;
    interactions_1: number;
    interactions_2: number;
    interactions_3: number;
    segment: string;
}
