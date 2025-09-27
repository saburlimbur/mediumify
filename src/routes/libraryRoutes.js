import express from 'express';
import * as libraryController from '../controllers/libraryController';
import verifyToken from '../middlewares/verifyToken';

const libraryRoutes = express.Router();

// save post ke library
libraryRoutes.post('/library/save', verifyToken, libraryController.saveLibraryController);

export default libraryRoutes;
