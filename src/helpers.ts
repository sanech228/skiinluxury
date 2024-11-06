

export function useHelpers() {
    const columns = [ { width: 120, title: '# ID', dataIndex: 'id', }, { width: 250, title: 'Name', resizable: true, dataIndex: 'name', }, { width: 'auto', title: 'URL', dataIndex: 'url', ellipsis: true,}, { width: 110, title: 'Status', dataIndex: 'status', resizable: true, }, { width: 200, title: 'Created', dataIndex: 'created', }, { width: '150px', title: 'Actions', dataIndex: 'actions', }];
    const emptyHome = {
        id: null,
        home: {
            path: '',
            url: '',
            title: '',
            rates: [] as any[],
            description: '',
            amenities: [] as any[],
            summary: [] as any[],
            photos: [] as any[],
        },
        name: '',
        status: '',
    };

    return {
        emptyHome,
        columns,
    }
}