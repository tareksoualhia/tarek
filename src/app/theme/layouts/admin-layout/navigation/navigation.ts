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
        id: 'infos',
        title: 'Infos',
        type: 'item',
        classes: 'nav-item',
        url: '/mes-informations',
         icon: 'info-circle'
      },
      {
        id: 'contrats',
        title: 'Offers',
        type: 'item',
        classes: 'nav-item',
        url: '/contrats',
         icon: 'tag'
      },
      {
        id: 'facture',
        title: 'Facture',
        type: 'item',
        classes: 'nav-item',
        url: '/facture',
         icon: 'file-invoice'
      },
       {
  id: 'reclamations',
  title: 'Réclamations',
  type: 'collapse', // menu with children
  icon: 'alert-circle', // you can change the icon (lucide / material)
  children: [
    {
      id: 'reclamations-list',
      title: 'Liste des Réclamations',
      type: 'item',
      url: '/reclamations',   // 🔹 route for ReclamationsListComponent
      classes: 'nav-item'
    },
    {
      id: 'add-reclamations',
      title: 'Ajouter une Réclamation',
      type: 'item',
      url: '/addreclamation', // 🔹 route for ReclamationsAddComponent
      classes: 'nav-item'
    }
  ]
},
     {
  id: 'videos',
  title: 'Videos',
  type: 'item',
  classes: 'nav-item',
  url: '/videos', // base path, no :id
  icon: 'video'
}
,
   {
        id: 'color',
        title: 'Products',
        type: 'item',
        classes: 'nav-item',
        url: '/products',
        icon: 'box'
      },
      
   {
        id: 'color',
        title: 'Panier',
        type: 'item',
        classes: 'nav-item',
        url: '/panier',
        icon: 'shopping-cart'
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
