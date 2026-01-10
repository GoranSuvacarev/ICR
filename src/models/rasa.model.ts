export interface RasaModel {
    text: string
    attachment: {
        type: 'all_toys' | 'search_toy' | 'filter_toys' | 'reserve_toy'
        data: any
        search: string
        filters: any
    }
}