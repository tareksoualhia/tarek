export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
 
  {
    id: 'utilities',
    title: 'UI Components',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'products',
        title: 'Products',
        type: 'collapse', // ⬅️ important : change "item" → "collapse" pour avoir des enfants
        icon: '',
        children: [
          {
            id: 'product-list',
            title: 'List Products',
            type: 'item',
            url: '/products',
            classes: ''
          },
          {
            id: 'add-product',
            title: 'Add Product',
            type: 'item',
            url: '/addproducts', // ⬅️ ou l'URL que tu utilises pour le formulaire d'ajout
            classes: ''
          }
        ]
      },
       {
        id: 'contratss',
        title: 'Offers',
        type: 'collapse', // ⬅️ important : change "item" → "collapse" pour avoir des enfants
        icon: '',
        children: [
          {
            id: 'contrats_list',
            title: 'Offers List',
            type: 'item',
            url: '/contrats',
            classes: ''
          },
          {
            id: 'add-contrats',
            title: 'Add Offer',
            type: 'item',
            url: '/addcontrats', // ⬅️ ou l'URL que tu utilises pour le formulaire d'ajout
            classes: ''
          }
        ]
      },
        
      
     
      
    
        {
        id: 'reclamations',
        title: 'reclamations',
        type: 'item',
        classes: 'nav-item',
        url: '/reclamations',
         icon: ''
      },
 {
  id: 'videos',
  title: 'Videos',
  type: 'item',
  classes: 'nav-item',
  url: '/videos', // base path for video call routing
  icon: 'video-camera' // use a relevant icon if available
},

      {
        id: 'color',
        title: 'Colors',
        type: 'item',
        classes: 'nav-item',
        url: '/color',
        icon: 'bg-colors'
      },
      {
        id: 'tabler',
        title: 'Tabler',
        type: 'item',
        classes: 'nav-item',
        url: 'https://ant.design/components/icon',
        icon: 'ant-design',
        target: true,
        external: true
      }
    ]
  },

  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'chrome'
      },
      {
        id: 'document',
        title: 'Document',
        type: 'item',
        classes: 'nav-item',
        url: 'https://codedthemes.gitbook.io/mantis-angular/',
        icon: 'question',
        target: true,
        external: true
      }
    ]
  }
];
