const modules = import.meta.glob('../apps/**/routes.js', { eager: true })

let appRoutes = []

Object.values(modules).forEach((module) => {
    appRoutes.push(...module.default)
})

const routes = [
    {
        path: '/',
        component: RootLayout,
        children: appRoutes
    }
]
export default routes;
