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
        key: '/app/profile1', title: 'menu.app.profile', icon: 'profile',
        sub: [
            {key: '/app/profile1/user1', title: 'menu.app.profile.user', icon: 'user'},
        ],
    },
];