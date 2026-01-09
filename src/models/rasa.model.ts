export interface RasaModel {
    text: string
    attachment: {
        type: 'all_toys' | 'search_toy' | 'filter_toys' | 'create_order'
        data: any
        search: string
        filters: any
    }
}