import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },

        {
        id: 2,
        label: 'Dashboard',
        icon: 'bx-health',
        link: '/',
    },
   /* {
        id: 3,
        label: 'Producto',
        icon: 'bx-health',
        subItems: [
            {
                id: 4,
                label: 'Listar',
                link: '/parcial/producto',
                parentId: 3
            },
            
        ]
    }*/
];

