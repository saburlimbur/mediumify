import userRoutes from "./userRoutes";

const routes = [
    userRoutes
];

// aggregator modular route
const router = (route) => {
    routes.forEach((r) => {
        route.use("/mediumify_api", r);
    });
};

export default router;