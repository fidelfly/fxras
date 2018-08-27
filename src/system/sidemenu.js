export const SiderMenus = [
    {key: '/app/home', title: 'menu.app.home', icon: 'home'},
    {
        key: '/app/profile', title: 'menu.app.profile', icon: 'profile',
        sub: [
            {key: '/app/profile/user', title: 'menu.app.profile.user', icon: 'user'},
            {key: '/app/profile/password', title: 'menu.app.profile.password', icon: 'user'},
        ],
    },
    {
        key: '/app/demo', title: 'menu.app.demo', icon: 'profile',
        sub: [
            {key: '/app/demo/progress', title: 'menu.app.demo.progress', icon: 'user'},
        ],
    },
];