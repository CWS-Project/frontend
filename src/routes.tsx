import { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from "./errors/NotFound"
import StoreProvider from "./context"

const ROUTES = import.meta.glob("/src/pages/**/[a-z[]*.tsx", { eager: true })
const routes = Object.keys(ROUTES).map((route) => {
    const path = route.replace(/\/src\/pages|index|\.tsx$/g, '')
        .replace(/\[\.{3}.+\]/, '*')
        .replace(/\[(.+)\]/, ':$1')

    // @ts-ignore
    const Component = ROUTES[route].default
    return { path, Component: Component }
})

export const AppRouter = () => {
    return (

        <BrowserRouter>
            <StoreProvider>
                <Suspense fallback={"Loading..."}>
                    <Routes>
                        {routes.map(({ path, Component }) => (
                            <Route key={path} path={path} Component={Component} />
                        ))}
                        <Route path="*" Component={NotFound} />
                    </Routes>
                </Suspense>

            </StoreProvider>
        </BrowserRouter>
    )
}