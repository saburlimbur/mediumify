import postRoutes from './postRoutes';
import userRoutes from './userRoutes';
import libraryRoutes from './libraryRoutes';

const routes = [userRoutes, postRoutes, libraryRoutes];

// aggregator modular route
const router = (route) => {
  routes.forEach((r) => {
    route.use('/mediumify_api', r);
  });
};

export default router;
