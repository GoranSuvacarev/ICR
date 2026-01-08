export interface RasaModel {
    text: string
    attachment: {
        type: 'toy_list' | 'single_toy' | 'type_list' | 'create_order'
        data: any
    }
}